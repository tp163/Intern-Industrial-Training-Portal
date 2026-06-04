"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PdfViewer } from "@/components/reports/pdf-viewer";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { currentStudent, studentReportProgress } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { cn, formatDate } from "@/lib/utils";
import type { LogbookReport } from "@/types";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FileText, Plus, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const statusFilterOptions: { key: string; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "unreviewed", label: "Unreviewed" },
  { key: "reviewed", label: "Reviewed" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function StudentReportsPage() {
  const { getReportsForStudent, submitLogbookReport } = useAppStore();
  const reports = getReportsForStudent(currentStudent.id);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newReport, setNewReport] = useState({ period: "", excerpt: "" });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const monthOptions = useMemo(() => {
    const keys = Array.from(new Set(reports.map((r) => r.monthKey))).sort().reverse();
    return [
      { key: "all", label: "All Months" },
      ...keys.map((k) => {
        const report = reports.find((r) => r.monthKey === k);
        return { key: k, label: report?.period ?? k };
      }),
    ];
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesMonth = monthFilter === "all" || r.monthKey === monthFilter;
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesMonth && matchesStatus;
    });
  }, [reports, monthFilter, statusFilter]);

  const detailReport = reports.find((r) => r.id === selectedId) ?? null;
  const { completed, total } = studentReportProgress;

  const handleSubmitReport = () => {
    if (!newReport.period.trim() || !newReport.excerpt.trim()) {
      notifyError("Please fill in the report period and summary.");
      return;
    }
    if (!pdfFile) {
      notifyError("Please upload your report as a PDF file.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      submitLogbookReport({
        studentId: currentStudent.id,
        period: newReport.period,
        excerpt: newReport.excerpt,
        pdfFile,
      });
      setSubmitting(false);
      setShowAdd(false);
      setNewReport({ period: "", excerpt: "" });
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      notifySuccess("Monthly report and PDF submitted successfully.");
    }, 600);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="ds-page-title">Logbook</h1>
            <p className="ds-page-description">
              Submit monthly reports as PDF and track supervisor reviews.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-card border border-border/60 bg-surface-muted px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Progress
              </p>
              <p className="mt-1 text-xl font-bold text-primary">
                {completed} / {total} Months
              </p>
            </div>
            <Button
              color="primary"
              radius="lg"
              className="font-semibold"
              startContent={<Plus size={18} />}
              onPress={() => setShowAdd(true)}
            >
              Add Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-card border border-border/60 bg-white p-4 shadow-card sm:grid-cols-2">
        <Select
          label="Filter by Month"
          selectedKeys={[monthFilter]}
          onSelectionChange={(keys) => setMonthFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
          aria-label="Month filter"
        >
          {monthOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Select
          label="Filter by Status"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => setStatusFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
          aria-label="Status filter"
        >
          {statusFilterOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No reports match your filters</p>
          <p className="mt-1 text-sm text-text-secondary">
            Submit a new report or adjust filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={() => setSelectedId(report.id)}
            />
          ))}
        </div>
      )}

      <AppModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Submit Monthly Report"
        size="2xl"
        footer={
          <>
            <Button variant="light" onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button
              color="primary"
              isLoading={submitting}
              isDisabled={!newReport.period.trim() || !newReport.excerpt.trim() || !pdfFile}
              onPress={handleSubmitReport}
            >
              Submit Report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Report Period"
            placeholder="e.g. Nov 2024"
            value={newReport.period}
            onValueChange={(v) => setNewReport((f) => ({ ...f, period: v }))}
            variant="bordered"
            radius="lg"
          />
          <Textarea
            label="Report Summary"
            placeholder="Brief summary of your monthly activities..."
            value={newReport.excerpt}
            onValueChange={(v) => setNewReport((f) => ({ ...f, excerpt: v }))}
            variant="bordered"
            radius="lg"
            minRows={4}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-text-primary">Report PDF (required)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            />
            {pdfFile ? (
              <div className="flex flex-col gap-2 rounded-button border border-border bg-surface-muted p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <FileText size={16} className="text-primary" />
                  {pdfFile.name}
                </span>
                <Button size="sm" variant="flat" onPress={() => fileInputRef.current?.click()}>
                  Replace PDF
                </Button>
              </div>
            ) : (
              <Button
                variant="bordered"
                radius="lg"
                className="w-full border-dashed"
                startContent={<Upload size={16} />}
                onPress={() => fileInputRef.current?.click()}
              >
                Upload PDF Report
              </Button>
            )}
          </div>
        </div>
      </AppModal>

      <AppModal
        isOpen={!!detailReport}
        onClose={() => setSelectedId(null)}
        title={detailReport ? `Monthly Report #${detailReport.monthNumber}` : "Report Details"}
        size="3xl"
        footer={
          <Button variant="light" onPress={() => setSelectedId(null)}>Close</Button>
        }
      >
        {detailReport && <ReportDetail report={detailReport} />}
      </AppModal>
    </div>
  );
}

function ReportCard({
  report,
  onView,
}: {
  report: LogbookReport;
  onView: () => void;
}) {
  const hasReview = report.status === "accepted" || report.status === "rejected" || report.status === "reviewed";

  return (
    <article className="flex flex-col rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-text-primary">
          Report #{report.monthNumber}
        </h3>
        {report.isCurrent && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Current
          </span>
        )}
        <ReportStatusBadge status={report.status} />
      </div>
      <p className="text-sm font-medium text-text-secondary">{report.period}</p>
      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{report.excerpt}</p>
      {report.pdfFileName && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
          <FileText size={14} />
          {report.pdfFileName}
        </p>
      )}
      {hasReview && report.marks != null && (
        <p className="mt-2 text-sm font-semibold text-text-primary">
          Marks: <span className="text-primary">{report.marks}</span>
        </p>
      )}
      <Button color="primary" variant="flat" radius="lg" className="mt-4 w-full" onPress={onView}>
        View Details
      </Button>
    </article>
  );
}

function ReportDetail({ report }: { report: LogbookReport }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-sm font-medium text-text-primary">
          {report.period}
        </span>
        <ReportStatusBadge status={report.status} />
        <span className="text-sm text-text-secondary">
          Submitted {formatDate(report.submittedAt)}
        </span>
      </div>

      <p className="text-base leading-relaxed text-text-primary">{report.excerpt}</p>

      <div>
        <p className="mb-2 text-sm font-semibold text-text-primary">Submitted PDF</p>
        <PdfViewer url={report.pdfUrl} fileName={report.pdfFileName} />
      </div>

      {(report.status === "accepted" || report.status === "rejected" || report.status === "reviewed") && (
        <div className="grid gap-4 rounded-button border border-border/60 bg-surface-muted p-4 sm:grid-cols-2">
          {report.marks != null && (
            <div>
              <p className="text-xs font-semibold uppercase text-text-secondary">Marks</p>
              <p className="mt-1 text-2xl font-bold text-primary">{report.marks}</p>
            </div>
          )}
          {report.feedback && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-text-secondary">
                Supervisor Comments
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-primary">{report.feedback}</p>
            </div>
          )}
          {report.reviewedAt && (
            <p className="text-xs text-text-secondary sm:col-span-2">
              Reviewed on {formatDate(report.reviewedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
