"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { BroadcastForm, type BroadcastFormValues } from "@/components/announcements/broadcast-form";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { currentAdmin } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export default function AdminBroadcastPage() {
  const { supervisors, publishAnnouncement, getAllAnnouncements } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const announcements = getAllAnnouncements().filter((a) => a.authorRole === "admin");

  const handlePublish = (values: BroadcastFormValues, targetSupervisorId?: string) => {
    setSubmitting(true);
    setTimeout(() => {
      const entry = publishAnnouncement({
        title: values.title,
        message: values.message,
        priority: values.priority,
        target: values.target,
        authorId: currentAdmin.id,
        authorName: currentAdmin.name,
        authorRole: "admin",
        supervisorId:
          values.target === "supervisor_students" ? targetSupervisorId : undefined,
        linkUrl: values.linkUrl || undefined,
        attachmentName: values.attachmentName || undefined,
        scheduledAt: values.scheduledAt
          ? new Date(values.scheduledAt).toISOString()
          : undefined,
        category: values.category,
      });
      setSubmitting(false);
      notifySuccess(
        entry.publishedAt
          ? "Broadcast published. Students have been notified."
          : "Broadcast scheduled for future publication."
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast"
        description="Send announcements to all students or to students under a specific supervisor"
      />

      <ContentCard title="Create Broadcast">
        <BroadcastForm
          authorRole="admin"
          supervisors={supervisors.map((s) => ({ id: s.id, name: s.name }))}
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
                <AnnouncementCard announcement={a} />
                <p className="text-xs text-text-secondary">
                  {a.publishedAt
                    ? `Published ${formatDate(a.publishedAt)}`
                    : a.scheduledAt
                      ? `Scheduled ${formatDate(a.scheduledAt)}`
                      : "Draft"}
                  {" · "}
                  Target: {a.target === "all_students" ? "All students" : "Supervisor group"}
                </p>
              </div>
            ))
          )}
        </div>
      </ContentCard>
    </div>
  );
}
