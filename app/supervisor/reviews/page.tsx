"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PdfViewer } from "@/components/reports/pdf-viewer";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { currentSupervisor } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import type { LogbookReport } from "@/types";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@heroui/react";
import { Check, Eye, X } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "unreviewed", label: "Unreviewed" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function SupervisorReviewsPage() {
  const { getReportsForSupervisor, reviewLogbookReport } = useAppStore();
  const allReports = getReportsForSupervisor(currentSupervisor.id);

  const [search, setSearch] = useState("");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<LogbookReport | null>(null);
  const [reviewMode, setReviewMode] = useState<"view" | "accept" | "reject">("view");
  const [feedback, setFeedback] = useState("");
  const [marks, setMarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return allReports.filter((r) => {
      const matchesSearch =
        !search ||
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.period.toLowerCase().includes(search.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesStudentId =
        !studentIdFilter ||
        r.studentName.toLowerCase().includes(studentIdFilter.toLowerCase());
      const submitted = new Date(r.submittedAt);
      const matchesFrom = !dateFrom || submitted >= new Date(dateFrom);
      const matchesTo = !dateTo || submitted <= new Date(dateTo + "T23:59:59");
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStudentId && matchesFrom && matchesTo && matchesStatus;
    });
  }, [allReports, search, studentIdFilter, dateFrom, dateTo, statusFilter]);

  const openReview = (report: LogbookReport, mode: "view" | "accept" | "reject") => {
    setSelected(report);
    setReviewMode(mode);
    setFeedback(report.feedback ?? "");
    setMarks(report.marks?.toString() ?? "");
  };

  const closeModal = () => {
    setSelected(null);
    setReviewMode("view");
    setFeedback("");
    setMarks("");
  };

  const handleSaveReview = (status: "accepted" | "rejected") => {
    if (!selected) return;
    const marksNum = Number(marks);
    if (Number.isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      notifyError("Please enter valid marks between 0 and 100.");
      return;
    }
    if (!feedback.trim()) {
      notifyError("Please provide review comments or feedback.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      reviewLogbookReport({
        reportId: selected.id,
        status,
        marks: marksNum,
        feedback: feedback.trim(),
      });
      setSubmitting(false);
      notifySuccess(`Report ${status === "accepted" ? "accepted" : "rejected"} successfully.`);
      closeModal();
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Review student logbook PDF submissions, assign marks, and set acceptance status"
      />

      <ContentCard>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search student or period..."
            className="md:col-span-2"
          />
          <Input
            label="Student ID / Name"
            placeholder="Filter"
            value={studentIdFilter}
            onValueChange={setStudentIdFilter}
            variant="bordered"
            radius="lg"
          />
          <Select
            label="Status"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => setStatusFilter((Array.from(keys)[0] as string) ?? "all")}
            variant="bordered"
            radius="lg"
          >
            {statusOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
          <Input type="date" label="From" value={dateFrom} onValueChange={setDateFrom} variant="bordered" radius="lg" />
          <Input type="date" label="To" value={dateTo} onValueChange={setDateTo} variant="bordered" radius="lg" />
        </div>

        <TableScroll>
          <Table aria-label="Student logbook reports" removeWrapper>
            <TableHeader>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn>PERIOD</TableColumn>
              <TableColumn className="hidden sm:table-cell">PDF</TableColumn>
              <TableColumn>MARKS</TableColumn>
              <TableColumn>SUBMITTED</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No reports match your filters.">
              {filtered.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <p className="font-medium">{report.studentName}</p>
                  </TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {report.pdfFileName ?? "—"}
                  </TableCell>
                  <TableCell>
                    {report.marks != null ? (
                      <span className="font-semibold text-primary">{report.marks}</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{formatDate(report.submittedAt)}</TableCell>
                  <TableCell>
                    <ReportStatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="light"
                        startContent={<Eye size={14} />}
                        onPress={() => openReview(report, "view")}
                      >
                        Review
                      </Button>
                      {report.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<Check size={14} />}
                            onPress={() => openReview(report, "accept")}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<X size={14} />}
                            onPress={() => openReview(report, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </ContentCard>

      <AppModal
        isOpen={!!selected}
        onClose={closeModal}
        title={
          reviewMode === "accept"
            ? "Accept Report"
            : reviewMode === "reject"
              ? "Reject Report"
              : `Review — ${selected?.studentName ?? ""}`
        }
        size="3xl"
        footer={
          reviewMode === "view" ? (
            <Button variant="light" onPress={closeModal}>Close</Button>
          ) : (
            <>
              <Button variant="light" onPress={closeModal}>Cancel</Button>
              <Button
                color={reviewMode === "accept" ? "success" : "danger"}
                isLoading={submitting}
                onPress={() =>
                  handleSaveReview(reviewMode === "accept" ? "accepted" : "rejected")
                }
              >
                Save &amp; {reviewMode === "accept" ? "Accept" : "Reject"}
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-text-primary">{selected.period}</span>
              <ReportStatusBadge status={selected.status} />
            </div>
            <p className="text-sm text-text-secondary">{selected.excerpt}</p>

            <div>
              <p className="mb-2 text-sm font-semibold text-text-primary">Submitted PDF</p>
              <PdfViewer url={selected.pdfUrl} fileName={selected.pdfFileName} />
            </div>

            <Input
              label="Marks (numeric)"
              type="number"
              min={0}
              max={100}
              value={marks}
              onValueChange={setMarks}
              variant="bordered"
              radius="lg"
              isReadOnly={reviewMode === "view" && selected.status !== "pending"}
              description="Enter a score from 0 to 100"
            />
            <Textarea
              label="Review Comments / Feedback"
              value={feedback}
              onValueChange={setFeedback}
              variant="bordered"
              radius="lg"
              minRows={4}
              isReadOnly={reviewMode === "view" && selected.status !== "pending"}
              placeholder="Provide detailed feedback for the student..."
            />

            {reviewMode === "view" && selected.status === "pending" && (
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <Button color="success" startContent={<Check size={16} />} onPress={() => setReviewMode("accept")}>
                  Accept Report
                </Button>
                <Button color="danger" variant="flat" startContent={<X size={16} />} onPress={() => setReviewMode("reject")}>
                  Reject Report
                </Button>
              </div>
            )}
          </div>
        )}
      </AppModal>
    </div>
  );
}
