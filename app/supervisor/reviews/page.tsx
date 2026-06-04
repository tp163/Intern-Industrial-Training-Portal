"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { currentSupervisor, reviews, students } from "@/data/mock";
import { capitalize, formatDate } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/notify";
import type { Review, ReviewStatus } from "@/types";
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
import { Check, FilePlus, X } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function SupervisorReviewsPage() {
  const [search, setSearch] = useState("");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState(
    () => reviews.filter((r) => r.supervisorId === currentSupervisor.id)
  );
  const [selected, setSelected] = useState<Review | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | "evaluate" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  const [newReport, setNewReport] = useState({
    studentRecordId: "",
    title: "",
    marks: "",
    evaluation: "",
  });

  const assignedStudents = students.filter((s) => s.supervisorId === currentSupervisor.id);

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const student = assignedStudents.find((s) => s.id === r.studentId);
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.studentName.toLowerCase().includes(search.toLowerCase());
      const matchesStudentId =
        !studentIdFilter ||
        student?.studentId.toLowerCase().includes(studentIdFilter.toLowerCase()) ||
        r.studentName.toLowerCase().includes(studentIdFilter.toLowerCase());
      const submitted = new Date(r.submittedAt);
      const matchesFrom = !dateFrom || submitted >= new Date(dateFrom);
      const matchesTo = !dateTo || submitted <= new Date(dateTo);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStudentId && matchesFrom && matchesTo && matchesStatus;
    });
  }, [items, search, studentIdFilter, dateFrom, dateTo, statusFilter, assignedStudents]);

  const openModal = (review: Review, act: "approve" | "reject" | "evaluate") => {
    setSelected(review);
    setAction(act);
    setFeedback(review.feedback ?? "");
    setScore(review.score?.toString() ?? "");
  };

  const handleSubmit = () => {
    if (!selected || !action || action === "evaluate") return;
    setSubmitting(true);
    setTimeout(() => {
      const newStatus: ReviewStatus = action === "approve" ? "approved" : "rejected";
      setItems((prev) =>
        prev.map((r) =>
          r.id === selected.id
            ? { ...r, status: newStatus, feedback, score: score ? Number(score) : r.score }
            : r
        )
      );
      setSubmitting(false);
      setSelected(null);
      setAction(null);
      notifySuccess(`Report ${newStatus}.`);
    }, 600);
  };

  const handleAddReport = () => {
    if (!newReport.studentRecordId) {
      notifyError("Please select a student.");
      return;
    }
    if (!newReport.title.trim()) {
      notifyError("Please enter a report title.");
      return;
    }
    const student = assignedStudents.find((s) => s.id === newReport.studentRecordId);
    if (!student) {
      notifyError("Selected student not found.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const entry: Review = {
        id: `rev-${Date.now()}`,
        studentId: student.id,
        studentName: student.name,
        supervisorId: currentSupervisor.id,
        title: newReport.title || "Supervisor Evaluation",
        type: "weekly",
        submittedAt: new Date().toISOString().slice(0, 10),
        status: "approved",
        content: newReport.evaluation,
        feedback: newReport.evaluation,
        score: Number(newReport.marks) || undefined,
      };
      setItems((prev) => [entry, ...prev]);
      setSubmitting(false);
      setShowAddReport(false);
      setNewReport({ studentRecordId: "", title: "", marks: "", evaluation: "" });
      notifySuccess("Evaluation report submitted.");
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Add marks, submit evaluations, and review student monthly reports"
        action={
          <Button
            color="primary"
            radius="lg"
            startContent={<FilePlus size={16} />}
            onPress={() => setShowAddReport(true)}
          >
            Add Evaluation
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title or student..."
            className="lg:col-span-2"
          />
          <Input
            label="Student ID"
            placeholder="Filter by ID"
            value={studentIdFilter}
            onValueChange={setStudentIdFilter}
            variant="bordered"
            radius="lg"
          />
          <Input
            type="date"
            label="From"
            value={dateFrom}
            onValueChange={setDateFrom}
            variant="bordered"
            radius="lg"
          />
          <Input
            type="date"
            label="To"
            value={dateTo}
            onValueChange={setDateTo}
            variant="bordered"
            radius="lg"
          />
          <Select
            className="xl:col-span-2"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string;
              if (val) setStatusFilter(val);
            }}
            variant="bordered"
            radius="lg"
            aria-label="Status"
          >
            {statusOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
        </div>

        <TableScroll>
        <Table aria-label="Reports table" removeWrapper>
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>MARKS</TableColumn>
            <TableColumn>SUBMITTED</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No reports match your filters.">
            {filtered.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <span className="font-medium">{review.title}</span>
                </TableCell>
                <TableCell>{review.studentName}</TableCell>
                <TableCell>{review.score != null ? `${review.score}%` : "—"}</TableCell>
                <TableCell>{formatDate(review.submittedAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={review.status} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {review.status === "pending" ? (
                      <>
                        <Button size="sm" color="success" variant="flat" radius="lg" startContent={<Check size={14} />} onPress={() => openModal(review, "approve")}>
                          Approve
                        </Button>
                        <Button size="sm" color="danger" variant="flat" radius="lg" startContent={<X size={14} />} onPress={() => openModal(review, "reject")}>
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="light" onPress={() => openModal(review, "evaluate")}>
                        View
                      </Button>
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
        isOpen={showAddReport}
        onClose={() => setShowAddReport(false)}
        title="Add Evaluation Report"
        footer={
          <>
            <Button variant="light" onPress={() => setShowAddReport(false)}>Cancel</Button>
            <Button
              color="primary"
              isLoading={submitting}
              isDisabled={!newReport.studentRecordId || !newReport.title.trim()}
              onPress={handleAddReport}
            >
              Submit Report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Student"
            placeholder="Select assigned student"
            selectedKeys={newReport.studentRecordId ? [newReport.studentRecordId] : []}
            onSelectionChange={(keys) => {
              const id = Array.from(keys)[0] as string;
              setNewReport((f) => ({ ...f, studentRecordId: id ?? "" }));
            }}
            variant="bordered"
            radius="lg"
          >
            {assignedStudents.map((s) => (
              <SelectItem key={s.id} textValue={s.studentId}>
                {s.name} ({s.studentId})
              </SelectItem>
            ))}
          </Select>
          <Input label="Report Title" value={newReport.title} onValueChange={(v) => setNewReport((f) => ({ ...f, title: v }))} variant="bordered" radius="lg" />
          <Input label="Marks (%)" type="number" min={0} max={100} value={newReport.marks} onValueChange={(v) => setNewReport((f) => ({ ...f, marks: v }))} variant="bordered" radius="lg" />
          <Textarea label="Evaluation" minRows={4} value={newReport.evaluation} onValueChange={(v) => setNewReport((f) => ({ ...f, evaluation: v }))} variant="bordered" radius="lg" placeholder="Enter evaluation notes..." />
        </div>
      </AppModal>

      <AppModal
        isOpen={!!selected && !!action}
        onClose={() => { setSelected(null); setAction(null); }}
        title={action === "approve" ? "Approve & Add Marks" : action === "reject" ? "Reject Report" : "Report Details"}
        footer={
          action !== "evaluate" ? (
            <>
              <Button variant="light" onPress={() => { setSelected(null); setAction(null); }}>Cancel</Button>
              <Button color={action === "approve" ? "success" : "danger"} isLoading={submitting} onPress={handleSubmit}>
                Confirm
              </Button>
            </>
          ) : (
            <Button variant="light" onPress={() => { setSelected(null); setAction(null); }}>Close</Button>
          )
        }
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{selected.title}</p>
              <p className="text-sm text-text-secondary">{selected.studentName} · {capitalize(selected.type)}</p>
            </div>
            <p className="rounded-lg bg-surface-sidebar p-3 text-sm">{selected.content}</p>
            {(action === "approve" || action === "evaluate") && (
              <Input label="Marks (%)" type="number" value={score} onValueChange={setScore} variant="bordered" radius="lg" isReadOnly={action === "evaluate"} />
            )}
            <Textarea label="Feedback / Evaluation" value={feedback} onValueChange={setFeedback} variant="bordered" radius="lg" minRows={4} isReadOnly={action === "evaluate"} />
          </div>
        )}
      </AppModal>
    </div>
  );
}
