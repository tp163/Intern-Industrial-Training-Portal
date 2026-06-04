"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { BroadcastForm, type BroadcastFormValues } from "@/components/announcements/broadcast-form";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { currentSupervisor } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function SupervisorBroadcastPage() {
  const { publishAnnouncement, getAllAnnouncements } = useAppStore();
  const [submitting, setSubmitting] = useState(false);

  const myAnnouncements = useMemo(
    () =>
      getAllAnnouncements().filter(
        (a) => a.authorId === currentSupervisor.id && a.authorRole === "supervisor"
      ),
    [getAllAnnouncements]
  );

  const handlePublish = (values: BroadcastFormValues) => {
    setSubmitting(true);
    setTimeout(() => {
      const entry = publishAnnouncement({
        title: values.title,
        message: values.message,
        priority: values.priority,
        target: "supervisor_students",
        authorId: currentSupervisor.id,
        authorName: currentSupervisor.name,
        authorRole: "supervisor",
        supervisorId: currentSupervisor.id,
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
          ? "Broadcast sent to your assigned students."
          : "Broadcast scheduled successfully."
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast"
        description="Send notices and reminders to students assigned to you"
      />

      <ContentCard title="Create Broadcast">
        <BroadcastForm
          authorRole="supervisor"
          supervisorId={currentSupervisor.id}
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
