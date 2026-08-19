"use client";

import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { Button, Input, Textarea, Card, CardBody, Chip } from "@heroui/react";
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle, Trash2, Edit, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { canStudentSubmitByInternshipStatus, internshipStatusSubmissionWarning } from "@/lib/utils";
import { apiCreateTrainingRecord, apiUploadFile } from "@/lib/api";

export default function StudentDailyLogPage() {
  const { reviews, submitDailyLog, deleteDailyLog, currentUser, getStudentById, loadRealData } = useAppStore();
  const userId = currentUser?.id ?? "";
  const student = getStudentById(userId);

  const [dateStr, setDateStr] = useState<string>(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - offset * 60 * 1000);
    return localToday.toISOString().split("T")[0];
  });
  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "cover">("daily");
  const [weeklyStatuses, setWeeklyStatuses] = useState<Record<string, "not_submitted" | "submitted" | "certified" | "revision_required">>({});
  const [weeklyFeedback, setWeeklyFeedback] = useState<Record<string, string>>({});
  const [coverFiles, setCoverFiles] = useState<Record<string, string | null>>({ A: null, B: null, C: null, D: null });
  const [entryCoverFiles, setEntryCoverFiles] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRealData();
  }, [loadRealData, userId]);

  // Filter logs for the current student that are of type "daily_log"
  const dailyLogs = useMemo(() => {
    return reviews
      .filter((r) => r.studentId === userId && r.type === "daily_log")
      .sort((a, b) => b.title.localeCompare(a.title)); // Sort by date descending
  }, [reviews, userId]);

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return dailyLogs;
    const q = search.toLowerCase();
    return dailyLogs.filter(
      (log) =>
        log.title.includes(q) ||
        log.content.toLowerCase().includes(q) ||
        (log.feedback && log.feedback.toLowerCase().includes(q))
    );
  }, [dailyLogs, search]);

  const weeklyEntries = useMemo(() => {
    const groups = new Map<string, { start: Date; end: Date; logs: typeof dailyLogs }>();
    dailyLogs.forEach((log) => {
      const date = new Date(`${log.title}T00:00:00`);
      if (Number.isNaN(date.getTime())) return;
      const day = date.getDay();
      const start = new Date(date);
      start.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const key = start.toISOString().slice(0, 10);
      const existing = groups.get(key);
      groups.set(key, { start, end, logs: existing ? [...existing.logs, log] : [log] });
    });
    return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [dailyLogs]);

  const uploadDiaryDocument = async (kind: "A" | "B" | "C" | "D", file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      notifyError("Please upload a PDF or image file.");
      return;
    }
    try {
      await apiUploadFile(file);
      setCoverFiles((current) => ({ ...current, [kind]: file.name }));
      notifySuccess(`${kind === "A" ? "Cover page" : kind === "B" ? "Daily training information" : kind === "C" ? "Weekly certification" : "Performance report"} uploaded.`);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to upload document.");
    }
  };
  const uploadEntryCover = async (entryId: string, file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") return notifyError("Please upload a PDF or image file.");
    try {
      await apiUploadFile(file);
      setEntryCoverFiles((current) => ({ ...current, [entryId]: file.name }));
      notifySuccess("Cover page uploaded for this daily entry.");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to upload cover page.");
    }
  };

  const handleSaveLog = async () => {
    if (!canStudentSubmitByInternshipStatus(student?.internshipStatus)) {
      notifyError(internshipStatusSubmissionWarning);
      return;
    }
    if (!activity.trim()) {
      notifyError("Please describe what you did today.");
      return;
    }
    const hrsVal = parseFloat(hours);
    if (hours && (isNaN(hrsVal) || hrsVal <= 0 || hrsVal > 24)) {
      notifyError("Please enter a valid number of hours (0 - 24).");
      return;
    }

    setSubmitting(true);
    try {
      // Check if entry for this date already exists (when creating a new log)
      if (!editingId && dailyLogs.some((l) => l.title === dateStr)) {
        notifyError(`You already have a log entry for ${dateStr}. Please edit the existing entry instead.`);
        setSubmitting(false);
        return;
      }

      await submitDailyLog({
        id: editingId ?? undefined,
        studentId: userId,
        title: dateStr, // date stored in title field
        content: activity.trim(),
        score: hours ? Math.round(hrsVal) : undefined, // store hours in score field
      });

      notifySuccess(editingId ? "Daily log updated successfully." : "Daily log saved successfully.");
      setActivity("");
      setHours("");
      setEditingId(null);
      await loadRealData();
    } catch (err: any) {
      notifyError(err.message || "Failed to save daily log.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (log: any) => {
    setEditingId(log.id);
    setDateStr(log.title);
    setActivity(log.content);
    setHours(log.score?.toString() ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) return;
    try {
      await deleteDailyLog(id);
      notifySuccess("Daily log entry deleted.");
      await loadRealData();
    } catch (err: any) {
      notifyError(err.message || "Failed to delete entry.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setActivity("");
    setHours("");
    const today = new Date().toISOString().split("T")[0];
    setDateStr(today);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header section */}
      <div className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-button bg-primary/10 p-2.5 text-primary">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="ds-page-title">Daily Log Book</h1>
            <p className="ds-page-description">
              Write a daily diary entry documenting your internship work, tasks, and reflections.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border/60 bg-surface-muted p-1">
        {[["daily", "Daily Entries"], ["weekly", "Weekly Certification"], ["cover", "Daily Log Book documents"]].map(([key, label]) => <Button key={key} variant={activeTab === key ? "solid" : "light"} color={activeTab === key ? "primary" : "default"} radius="lg" onPress={() => setActiveTab(key as typeof activeTab)}>{label}</Button>)}
      </div>

      {activeTab === "daily" && <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Diary entry form */}
        <div className="lg:col-span-1">
          <Card className="border border-border/60 bg-white shadow-card" radius="lg">
            <CardBody className="space-y-4 p-5">
              <h2 className="text-lg font-bold text-text-primary">
                {editingId ? "Edit Diary Entry" : "Write Today's Diary"}
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Log Date
                </label>
                <Input
                  type="date"
                  value={dateStr}
                  onValueChange={setDateStr}
                  isDisabled={!!editingId}
                  variant="bordered"
                  radius="lg"
                  startContent={<Calendar size={16} className="text-text-secondary" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Hours Worked
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 8"
                  value={hours}
                  onValueChange={setHours}
                  variant="bordered"
                  radius="lg"
                  startContent={<Clock size={16} className="text-text-secondary" />}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  What did you do?
                </label>
                <Textarea
                  placeholder="Describe your daily activities, achievements, or challenges..."
                  value={activity}
                  onValueChange={setActivity}
                  variant="bordered"
                  radius="lg"
                  minRows={6}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  color="primary"
                  className="flex-1 font-semibold"
                  radius="lg"
                  isLoading={submitting}
                  onPress={handleSaveLog}
                >
                  {editingId ? "Update Entry" : "Save Entry"}
                </Button>
                {editingId && (
                  <Button variant="flat" radius="lg" onPress={handleCancelEdit}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Diary Timeline / Logs List */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-card border border-border/60 bg-white p-4 shadow-card flex items-center justify-between gap-4">
            <Input
              placeholder="Search diary entries..."
              value={search}
              onValueChange={setSearch}
              variant="bordered"
              radius="lg"
              className="max-w-xs"
            />
            <div className="text-sm text-text-secondary">
              Total: <span className="font-semibold text-primary">{dailyLogs.length} entries</span>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="rounded-card border border-border/60 bg-white p-12 text-center shadow-card">
              <BookOpen size={48} className="mx-auto text-text-secondary/40 mb-3" />
              <p className="font-medium text-text-primary">No diary entries found</p>
              <p className="mt-1 text-sm text-text-secondary">
                {search ? "Try adjusting your search query." : "Start writing your first entry on the left!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const isViewed = log.status === "approved";
                return (
                  <Card key={log.id} className="border border-border/60 bg-white shadow-sm hover:shadow-card transition-all" radius="lg">
                    <CardBody className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-text-primary flex items-center gap-1.5">
                            <Calendar size={16} className="text-primary" />
                            {log.title}
                          </span>
                          {log.score && (
                            <Chip size="sm" variant="flat" color="secondary" startContent={<Clock size={12} />}>
                              {log.score} hrs
                            </Chip>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isViewed ? (
                            <Chip
                              size="sm"
                              color="success"
                              variant="flat"
                              startContent={<CheckCircle2 size={14} />}
                            >
                              Viewed by Supervisor
                            </Chip>
                          ) : (
                            <Chip
                              size="sm"
                              color="warning"
                              variant="flat"
                              startContent={<AlertCircle size={14} />}
                            >
                              Unviewed
                            </Chip>
                          )}
                          {!isViewed && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="flat"
                                isIconOnly
                                radius="md"
                                onPress={() => handleEdit(log)}
                                title="Edit Entry"
                              >
                                <Edit size={14} className="text-text-secondary" />
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                isIconOnly
                                radius="md"
                                onPress={() => handleDelete(log.id)}
                                title="Delete Entry"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {log.content}
                      </p>

                      {log.feedback && (
                        <div className="mt-2 rounded-button bg-surface-muted border border-border/50 p-3">
                          <p className="text-xs font-semibold text-text-secondary uppercase">
                            Supervisor Feedback
                          </p>
                          <p className="mt-1 text-sm text-text-primary leading-relaxed">
                            {log.feedback}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                        {entryCoverFiles[log.id] && <span className="text-xs text-success">Cover page: {entryCoverFiles[log.id]}</span>}
                        <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-xs font-medium text-text-primary"><Upload size={14} className="mr-1.5" /> {entryCoverFiles[log.id] ? "Replace cover page" : "Add cover page"}<input type="file" accept="application/pdf,image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadEntryCover(log.id, file); event.currentTarget.value = ""; }} /></label>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>}

      {activeTab === "weekly" && <div className="space-y-4">{weeklyEntries.length === 0 ? <Card><CardBody className="p-8 text-center text-sm text-text-secondary">Add daily entries to create weekly certification periods.</CardBody></Card> : weeklyEntries.map(([key, week], index) => { const status = weeklyStatuses[key] ?? "not_submitted"; return <Card key={key} className="border border-border/60 bg-white" radius="lg"><CardBody className="space-y-4 p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-semibold">Week {weeklyEntries.length - index}: {week.start.toLocaleDateString()} – {week.end.toLocaleDateString()}</h2><p className="text-sm text-text-secondary">{week.logs.length} daily entr{week.logs.length === 1 ? "y" : "ies"}</p></div><Chip color={status === "certified" ? "success" : status === "revision_required" ? "danger" : status === "submitted" ? "warning" : "default"} variant="flat">{status.replace("_", " ")}</Chip></div>{weeklyFeedback[key] && <p className="rounded-lg bg-surface-muted p-3 text-sm">Supervisor remarks: {weeklyFeedback[key]}</p>}</CardBody></Card>; })}</div>}

      {activeTab === "weekly" && weeklyEntries.map(([key, week], index) => { const status = weeklyStatuses[key] ?? "not_submitted"; return status === "not_submitted" ? <Card key={`upload-${key}`} className="border border-border/60 bg-white" radius="lg"><CardBody className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">Week {weeklyEntries.length - index}: signed weekly certification</p><p className="text-sm text-text-secondary">Upload the completed weekly certification PDF for {week.start.toLocaleDateString()} – {week.end.toLocaleDateString()}.</p></div><label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white"><Upload size={15} className="mr-2" /> Submit week for certification<input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void apiUploadFile(file).then((uploaded) => apiCreateTrainingRecord("weekly_certifications", { student_id: userId, week_start_date: key, week_end_date: week.end.toISOString().slice(0, 10), daily_log_ids: week.logs.map((log) => log.id), file_url: uploaded.url, status: "submitted" })).then(() => { setWeeklyStatuses((current) => ({ ...current, [key]: "submitted" })); notifySuccess("Weekly certification PDF submitted."); }).catch((error) => notifyError(error instanceof Error ? error.message : "Failed to upload weekly certification PDF.")); event.currentTarget.value = ""; }} /></label></CardBody></Card> : null; })}

      {activeTab === "cover" && <div className="space-y-4"><Card className="border border-border/60 bg-white" radius="lg"><CardBody className="space-y-4 p-5"><h2 className="text-lg font-semibold">Daily Log Book documents</h2><p className="text-sm text-text-secondary">Cover pages are uploaded against their individual daily entries. Upload the completed and signed performance report here when required.</p><div className="flex flex-col justify-between gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center"><div><p className="font-medium">Progress Report on Industrial Trainee Performance</p>{coverFiles.D && <p className="mt-1 text-xs text-success">Uploaded: {coverFiles.D}</p>}</div><div className="flex gap-2"><Button variant="flat" color="danger" isDisabled={!coverFiles.D} onPress={() => setCoverFiles((current) => ({ ...current, D: null }))}>Delete</Button><label className="inline-flex h-10 cursor-pointer items-center rounded-lg bg-primary px-4 text-sm font-medium text-white"><Upload size={15} className="mr-2" /> {coverFiles.D ? "Replace" : "Upload PDF/image"}<input type="file" accept="application/pdf,image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadDiaryDocument("D", file); event.currentTarget.value = ""; }} /></label></div></div></CardBody></Card></div>}
    </div>
  );
}
