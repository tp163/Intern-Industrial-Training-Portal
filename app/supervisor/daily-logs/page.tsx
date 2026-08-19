"use client";

import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { PageHeader, ContentCard } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { Button, Select, SelectItem, Card, CardBody, Chip, Textarea } from "@heroui/react";
import { Check, Calendar, Clock, BookOpen, User, CheckCircle2, MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";

export default function SupervisorDailyLogsPage() {
  const { reviews, updateDailyLogStatus, currentUser, supervisors, students, loadRealData } = useAppStore();

  const supervisorRecord = useMemo(
    () =>
      supervisors.find((s) => s.id === currentUser?.id) ??
      supervisors.find((s) => s.email === currentUser?.email),
    [currentUser?.email, currentUser?.id, supervisors]
  );
  const supervisorId = supervisorRecord?.id ?? currentUser?.id ?? "";

  const [studentIdFilter, setStudentIdFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [submittingIds, setSubmittingIds] = useState<Record<string, boolean>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRealData();
  }, [loadRealData, supervisorId]);

  // Filter students assigned to this supervisor
  const myStudents = useMemo(() => {
    return students.filter((s) => !supervisorId || s.supervisorId === supervisorId);
  }, [students, supervisorId]);

  const studentOptions = useMemo(() => {
    return [
      { key: "all", label: "All Students" },
      ...myStudents.map((s) => ({ key: s.id, label: s.name })),
    ];
  }, [myStudents]);

  // Filter logs that belong to supervisor's students and are of type "daily_log"
  const dailyLogs = useMemo(() => {
    const studentIds = new Set(myStudents.map((s) => s.id));
    return reviews
      .filter((r) => r.type === "daily_log" && studentIds.has(r.studentId))
      .sort((a, b) => b.title.localeCompare(a.title)); // Sort by date descending
  }, [reviews, myStudents]);

  const filteredLogs = useMemo(() => {
    return dailyLogs.filter((log) => {
      const matchesStudent = studentIdFilter === "all" || log.studentId === studentIdFilter;
      const isViewed = log.status === "approved";
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "viewed" && isViewed) ||
        (statusFilter === "unviewed" && !isViewed);
      const matchesSearch =
        !search ||
        log.studentName.toLowerCase().includes(search.toLowerCase()) ||
        log.content.toLowerCase().includes(search.toLowerCase()) ||
        log.title.includes(search);

      return matchesStudent && matchesStatus && matchesSearch;
    });
  }, [dailyLogs, studentIdFilter, statusFilter, search]);

  const handleMarkAsViewed = async (logId: string) => {
    setSubmittingIds((prev) => ({ ...prev, [logId]: true }));
    try {
      const feedbackText = feedbacks[logId]?.trim() || "";
      await updateDailyLogStatus(logId, "approved", feedbackText || undefined);
      notifySuccess("Daily log marked as viewed.");
      await loadRealData();
    } catch (err: any) {
      notifyError(err.message || "Failed to update daily log status.");
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [logId]: false }));
    }
  };

  const handleMarkAsUnviewed = async (logId: string) => {
    setSubmittingIds((prev) => ({ ...prev, [logId]: true }));
    try {
      await updateDailyLogStatus(logId, "pending");
      notifySuccess("Daily log marked as unviewed.");
      await loadRealData();
    } catch (err: any) {
      notifyError(err.message || "Failed to update daily log status.");
    } finally {
      setSubmittingIds((prev) => ({ ...prev, [logId]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Logs"
        description="Monitor and view daily diary logs submitted by your assigned student interns."
      />

      {/* Filters section */}
      <div className="grid grid-cols-1 gap-4 rounded-card border border-border/60 bg-white p-4 shadow-card sm:grid-cols-3">
        <Select
          label="Filter by Student"
          selectedKeys={[studentIdFilter]}
          onSelectionChange={(keys) => setStudentIdFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
          aria-label="Student filter"
        >
          {studentOptions.map((opt) => (
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
          <SelectItem key="all">All Logs</SelectItem>
          <SelectItem key="unviewed">Unviewed Logs</SelectItem>
          <SelectItem key="viewed">Viewed Logs</SelectItem>
        </Select>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search logs content or date..."
          className="w-full"
        />
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <ContentCard>
            <div className="py-12 text-center">
              <BookOpen size={48} className="mx-auto text-text-secondary/40 mb-3" />
              <p className="font-medium text-text-primary">No daily logs match the filters</p>
              <p className="mt-1 text-sm text-text-secondary">
                Adjust your filters or search query to find entries.
              </p>
            </div>
          </ContentCard>
        ) : (
          filteredLogs.map((log) => {
            const isViewed = log.status === "approved";
            return (
              <Card key={log.id} className="border border-border/60 bg-white shadow-sm hover:shadow-card transition-all" radius="lg">
                <CardBody className="p-5 space-y-4">
                  {/* Top info row */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-text-primary text-base flex items-center gap-1">
                          <User size={16} className="text-primary" />
                          {log.studentName}
                        </span>
                        <Chip size="sm" variant="flat" color="primary" startContent={<Calendar size={12} />}>
                          {log.title}
                        </Chip>
                        {log.score && (
                          <Chip size="sm" variant="flat" color="secondary" startContent={<Clock size={12} />}>
                            {log.score} hrs worked
                          </Chip>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Submitted {formatDate(log.submittedAt)}
                      </p>
                    </div>

                     <div>
                      {isViewed ? (
                        <div className="flex items-center gap-2">
                          <Chip
                            color="success"
                            variant="flat"
                            startContent={<CheckCircle2 size={16} />}
                          >
                            Viewed / Checked
                          </Chip>
                          <Button
                            color="warning"
                            variant="flat"
                            radius="lg"
                            size="sm"
                            isLoading={submittingIds[log.id]}
                            onPress={() => handleMarkAsUnviewed(log.id)}
                          >
                            Undo Viewed
                          </Button>
                        </div>
                      ) : (
                        <Button
                          color="success"
                          radius="lg"
                          size="sm"
                          className="font-semibold text-white bg-success"
                          startContent={<Check size={16} />}
                          isLoading={submittingIds[log.id]}
                          onPress={() => handleMarkAsViewed(log.id)}
                        >
                          Mark as Viewed
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Diary content */}
                  <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed bg-surface-muted p-4 rounded-button border border-border/40">
                    {log.content}
                  </p>

                  {/* Feedback block */}
                  <div className="border-t border-border/40 pt-3">
                    {isViewed ? (
                      log.feedback ? (
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                            <MessageSquare size={12} />
                            Your Feedback
                          </span>
                          <p className="text-sm text-text-secondary italic">
                            "{log.feedback}"
                          </p>
                        </div>
                      ) : null
                    ) : (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare size={12} />
                          Add Feedback (Optional)
                        </span>
                        <Textarea
                          placeholder="Type feedback, suggestions, or comments before marking as viewed..."
                          value={feedbacks[log.id] ?? log.feedback ?? ""}
                          onValueChange={(val) => setFeedbacks((prev) => ({ ...prev, [log.id]: val }))}
                          variant="bordered"
                          radius="lg"
                          minRows={2}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
