"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { currentSupervisor, reviews } from "@/data/mock";
import { capitalize, formatDate } from "@/lib/utils";
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
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function SupervisorReviewsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState(
    () => reviews.filter((r) => r.supervisorId === currentSupervisor.id)
  );
  const [selected, setSelected] = useState<Review | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.studentName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const openModal = (review: Review, act: "approve" | "reject") => {
    setSelected(review);
    setAction(act);
    setFeedback(review.feedback ?? "");
    setScore(review.score?.toString() ?? "");
  };

  const handleSubmit = () => {
    if (!selected || !action) return;
    setSubmitting(true);
    setTimeout(() => {
      const newStatus: ReviewStatus = action === "approve" ? "approved" : "rejected";
      setItems((prev) =>
        prev.map((r) =>
          r.id === selected.id
            ? {
                ...r,
                status: newStatus,
                feedback,
                score: score ? Number(score) : r.score,
              }
            : r
        )
      );
      setSubmitting(false);
      setSelected(null);
      setAction(null);
      setFeedback("");
      setScore("");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Reviews"
        description="Review and approve student progress submissions"
      />

      <ContentCard>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title or student..."
            className="flex-1"
          />
          <Select
            className="w-full sm:w-48"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              if (selected) setStatusFilter(selected);
            }}
            variant="bordered"
            radius="lg"
            aria-label="Filter by status"
          >
            {statusOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Table aria-label="Reviews table" removeWrapper>
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>SUBMITTED</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {filtered.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <span className="font-medium">{review.title}</span>
                </TableCell>
                <TableCell>{review.studentName}</TableCell>
                <TableCell>{capitalize(review.type)}</TableCell>
                <TableCell>{formatDate(review.submittedAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={review.status} />
                </TableCell>
                <TableCell>
                  {review.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        radius="lg"
                        startContent={<Check size={14} />}
                        onPress={() => openModal(review, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        radius="lg"
                        startContent={<X size={14} />}
                        onPress={() => openModal(review, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-text-secondary">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentCard>

      <AppModal
        isOpen={!!selected && !!action}
        onClose={() => {
          setSelected(null);
          setAction(null);
        }}
        title={action === "approve" ? "Approve Review" : "Reject Review"}
        footer={
          <>
            <Button
              variant="light"
              radius="lg"
              onPress={() => {
                setSelected(null);
                setAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color={action === "approve" ? "success" : "danger"}
              radius="lg"
              isLoading={submitting}
              onPress={handleSubmit}
            >
              Confirm {action === "approve" ? "Approval" : "Rejection"}
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{selected.title}</p>
              <p className="text-sm text-text-secondary">{selected.studentName}</p>
            </div>
            <p className="rounded-lg bg-surface-sidebar p-3 text-sm">{selected.content}</p>
            {action === "approve" && (
              <Input
                label="Score (optional)"
                type="number"
                min={0}
                max={100}
                value={score}
                onValueChange={setScore}
                variant="bordered"
                radius="lg"
                placeholder="0–100"
              />
            )}
            <Textarea
              label="Feedback"
              placeholder="Provide feedback to the student..."
              value={feedback}
              onValueChange={setFeedback}
              variant="bordered"
              radius="lg"
              minRows={4}
              isRequired
            />
          </div>
        )}
      </AppModal>
    </div>
  );
}
