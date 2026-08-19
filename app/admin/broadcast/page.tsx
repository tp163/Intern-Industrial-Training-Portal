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
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminBroadcastPage() {
  const { currentUser, supervisors, students, addPersistedAnnouncement, getAllAnnouncements, loadRealData, removeAnnouncement } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const announcements = getAllAnnouncements().filter((a) => a.authorRole === "admin");

  const handlePublish = async (values: BroadcastFormValues, targetSupervisorId?: string) => {
    setSubmitting(true);
    try {
      const newAnnouncement = {
        title: values.title,
        message: values.message,
        priority: values.priority,
        target: values.target,
        author_id: currentUser?.id ?? null,
        author_name: currentUser?.name ?? "Admin",
        author_role: "admin",
        supervisor_id: values.target === "supervisor_students" ? targetSupervisorId : null,
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
          ? "Broadcast published. Students have been notified."
          : "Broadcast scheduled for future publication."
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
        description="Send announcements to all students, students under a supervisor, or specific students"
      />

      <ContentCard title="Create Broadcast">
        <BroadcastForm
          authorRole="admin"
          supervisors={supervisors.map((s) => ({ id: s.id, name: s.name }))}
          students={students.map((s) => ({ id: s.id, name: s.name, studentId: s.studentId }))}
          onSubmit={handlePublish}
          submitting={submitting}
        />
      </ContentCard>

      <ContentCard title="Published & Scheduled">
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-sm text-text-secondary">No broadcasts yet.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="space-y-2">
                <div className="flex justify-end">
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
                <p className="text-xs text-text-secondary">
                  {a.publishedAt
                    ? `Published ${formatDate(a.publishedAt)}`
                    : a.scheduledAt
                      ? `Scheduled ${formatDate(a.scheduledAt)}`
                      : "Draft"}
                  {" · "}
                  Target: {
                    a.target === "all_students"
                      ? "All students"
                      : a.target === "specific_students"
                        ? "Specific students"
                        : "Supervisor group"
                  }
                </p>
              </div>
            ))
          )}
        </div>
      </ContentCard>
    </div>
  );
}
