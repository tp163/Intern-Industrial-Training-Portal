"use client";

import { AppModal } from "@/components/ui/app-modal";
import {
  currentStudent,
  monthlyReports,
  studentReportProgress,
} from "@/data/mock";
import { notifyError, notifySuccess } from "@/lib/notify";
import { cn } from "@/lib/utils";
import type { MonthlyReport } from "@/types";
import { Button, Input, Textarea } from "@heroui/react";
import { ArrowRight, Plus, Star } from "lucide-react";
import { useMemo, useState } from "react";

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={18}
          className={cn(
            i < value ? "fill-primary text-primary" : "fill-transparent text-border"
          )}
        />
      ))}
    </div>
  );
}

export default function StudentReportsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reports, setReports] = useState(
    () => monthlyReports.filter((r) => r.studentId === currentStudent.id)
  );
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReport, setNewReport] = useState({ period: "", excerpt: "" });

  const myReports = useMemo(
    () => [...reports].sort((a, b) => b.monthNumber - a.monthNumber),
    [reports]
  );

  const pending = myReports.filter((r) => r.status === "pending");
  const past = myReports.filter((r) => r.status === "reviewed");
  const detailReport = myReports.find((r) => r.id === selectedId) ?? null;

  const { completed, total } = studentReportProgress;

  const handleSubmitReport = () => {
    if (!newReport.period.trim() || !newReport.excerpt.trim()) {
      notifyError("Please fill in the report period and summary.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const nextNum = Math.max(...reports.map((r) => r.monthNumber), 0) + 1;
      const entry: MonthlyReport = {
        id: `mr-${Date.now()}`,
        studentId: currentStudent.id,
        monthNumber: nextNum,
        period: newReport.period.trim(),
        status: "pending",
        excerpt: newReport.excerpt.trim(),
        isCurrent: true,
      };
      setReports((prev) => [...prev.map((r) => ({ ...r, isCurrent: false })), entry]);
      setSubmitting(false);
      setShowAdd(false);
      setNewReport({ period: "", excerpt: "" });
      notifySuccess("Monthly report submitted for review.");
    }, 800);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              Logbook
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Submit and track your monthly internship reports.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <Button
            color="primary"
            radius="lg"
            startContent={<Plus size={16} />}
            onPress={() => setShowAdd(true)}
          >
            Add Report
          </Button>
          <div className="rounded-card border border-border/60 bg-surface-muted px-4 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
              Total Progress
            </p>
            <p className="mt-1 text-xl font-bold text-primary">
              {completed} / {total} Months
            </p>
          </div>
          </div>
        </div>
      </div>

      <AppModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Submit Monthly Report"
        footer={
          <>
            <Button variant="light" onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button
              color="primary"
              isLoading={submitting}
              isDisabled={!newReport.period.trim() || !newReport.excerpt.trim()}
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
            placeholder="Describe your activities, achievements, and learning outcomes..."
            value={newReport.excerpt}
            onValueChange={(v) => setNewReport((f) => ({ ...f, excerpt: v }))}
            variant="bordered"
            radius="lg"
            minRows={6}
          />
        </div>
      </AppModal>

      <AppModal
        isOpen={!!detailReport}
        onClose={() => setSelectedId(null)}
        title={detailReport ? `Monthly Report #${detailReport.monthNumber}` : "Report Details"}
        footer={
          <Button variant="light" onPress={() => setSelectedId(null)}>
            Close
          </Button>
        }
      >
        {detailReport && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#FFF3E0] px-2.5 py-0.5 text-xs font-semibold text-[#E65100]">
                {detailReport.period}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  detailReport.status === "pending"
                    ? "bg-[#FFF3E0] text-[#E65100]"
                    : "bg-[#E8F0EA] text-[#2E7D32]"
                )}
              >
                {detailReport.status === "pending" ? "Pending Review" : "Reviewed"}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-text-primary">{detailReport.excerpt}</p>
            {detailReport.feedback && (
              <div className="rounded-button border border-border/60 bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase text-text-secondary">Supervisor Feedback</p>
                <p className="mt-2 text-sm text-text-primary">{detailReport.feedback}</p>
              </div>
            )}
            {detailReport.rating != null && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">Rating</p>
                <StarRating value={detailReport.rating} />
              </div>
            )}
          </div>
        )}
      </AppModal>

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-[#FF9800]" />
            Pending Review
          </h2>
          {pending.map((report) => (
            <article
              key={report.id}
              className={cn(
                "rounded-card border bg-[#FFF9F5] p-5 shadow-card",
                selectedId === report.id && "ring-1 ring-primary/30"
              )}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-text-primary">
                  Monthly Report #{report.monthNumber}
                </h3>
                {report.isCurrent && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Current
                  </span>
                )}
                <span className="rounded-full bg-[#FFF3E0] px-2.5 py-0.5 text-xs font-semibold text-[#E65100]">
                  {report.period}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">{report.excerpt}</p>
              <Button
                color="primary"
                radius="lg"
                className="mt-4 font-semibold"
                endContent={<ArrowRight size={16} />}
                onPress={() => setSelectedId(report.id)}
              >
                View Details
              </Button>
            </article>
          ))}
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Past Submissions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((report) => (
              <article
                key={report.id}
                className={cn(
                  "rounded-card border border-border/60 bg-white p-5 shadow-card",
                  selectedId === report.id && "ring-1 ring-primary/30"
                )}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-text-primary">
                    Monthly Report #{report.monthNumber}
                  </h3>
                  <span className="rounded-full bg-[#E8F0EA] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2E7D32]">
                    Reviewed
                  </span>
                </div>
                <p className="text-xs font-medium text-text-secondary">{report.period}</p>
                {report.rating != null && (
                  <div className="mt-2">
                    <StarRating value={report.rating} />
                  </div>
                )}
                <p className="mt-3 line-clamp-3 text-sm text-text-secondary">
                  {report.feedback ?? report.excerpt}
                </p>
                <Button
                  variant="bordered"
                  radius="lg"
                  className="mt-4 w-full border-border font-semibold text-text-primary"
                  onPress={() => setSelectedId(report.id)}
                >
                  View Details
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
