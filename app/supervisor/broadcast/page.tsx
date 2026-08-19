"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { BroadcastForm, type BroadcastFormValues } from "@/components/announcements/broadcast-form";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate } from "@/lib/utils";
import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SupervisorBroadcastPage() {
  const { currentUser, supervisors, students, addPersistedAnnouncement, getAllAnnouncements, loadRealData, removeAnnouncement } = useAppStore();
  const supervisorRecord = useMemo(
    () =>
      supervisors.find((supervisor) => supervisor.id === currentUser?.id) ??
      supervisors.find((supervisor) => supervisor.email === currentUser?.email),
    [currentUser?.email, currentUser?.id, supervisors]
  );
  const supervisorId = supervisorRecord?.id ?? currentUser?.id ?? "";
  const supervisorName = supervisorRecord?.name ?? currentUser?.name ?? "Supervisor";
  
  // Get students assigned to this supervisor
  const assignedStudents = useMemo(
    () => students.filter((s) => s.supervisorId === supervisorId),
    [students, supervisorId]
  );
  
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const myAnnouncements = useMemo(
    () =>
      getAllAnnouncements().filter(
        (a) =>
          a.authorRole === "supervisor" &&
          (a.authorId === supervisorId || a.supervisorId === supervisorId)
      ),
    [getAllAnnouncements, supervisorId]
  );

  const handlePublish = async (values: BroadcastFormValues) => {
    setSubmitting(true);
    try {
      const newAnnouncement = {
        title: values.title,
        message: values.message,
        priority: values.priority,
        target: values.target,
        author_id: supervisorId,
        author_name: supervisorName,
        author_role: "supervisor",
        supervisor_id: supervisorId,
        ...(values.target === "specific_students"
          ? { student_ids: values.selectedStudentIds }
          : {}),
        link_url: values.linkUrl || null,
        attachment_name: values.attachmentName || null,
        attachment_url: values.attachmentUrl || null,
        scheduled_at: values.scheduledAt
          ? new Date(values.scheduledAt).toISOString()
          : null,
        category: values.category,
      };

      const response = await authFetch(`${API_BASE}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create announcement");
      }

      addPersistedAnnouncement(result.data);
      await loadRealData();

      notifySuccess(
        !values.scheduledAt
          ? "Broadcast sent to your assigned students."
          : "Broadcast scheduled successfully."
      );
    } catch (err: any) {
      console.error(err);
      notifyError(err instanceof Error ? err.message : "Failed to publish broadcast.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await authFetch(`${API_BASE}/announcements/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete broadcast");
      }
      removeAnnouncement(id);
      await loadRealData();
      notifySuccess("Broadcast deleted.");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to delete broadcast.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast"
        description="Send messages to all your assigned students or specific students"
      />

      <ContentCard title="Create Broadcast">
        <BroadcastForm
          authorRole="supervisor"
          supervisorId={supervisorId}
          students={assignedStudents.map((s) => ({ id: s.id, name: s.name }))}
          onSubmit={(v) => handlePublish(v)}
          submitting={submitting}
        />
      </ContentCard>

      <ContentCard title="Your Broadcasts">
        <div className="space-y-4">
          {myAnnouncements.length === 0 ? (
            <p className="text-sm text-text-secondary">No broadcasts yet.</p>
          ) : (
            myAnnouncements.map((a) => (
              <div key={a.id}>
                <div className="mb-2 flex justify-end">
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    startContent={<Trash2 size={14} />}
                    isLoading={deletingId === a.id}
                    onPress={() => handleDelete(a.id)}
                  >
                    Delete
                  </Button>
                </div>
                <AnnouncementCard announcement={a} />
                <p className="mt-1 text-xs text-text-secondary">
                  {a.publishedAt
                    ? `Published ${formatDate(a.publishedAt)}`
                    : `Scheduled ${a.scheduledAt ? formatDate(a.scheduledAt) : "—"}`}
                </p>
              </div>
            ))
          )}
        </div>
      </ContentCard>
    </div>
  );
}
