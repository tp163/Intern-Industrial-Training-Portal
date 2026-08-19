"use client";

import { AppModal } from "@/components/ui/app-modal";
import { useAppStore } from "@/lib/store/app-store";
import { cn, formatDate } from "@/lib/utils";
import type { AppNotification, NotificationAudience } from "@/types";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";

const categoryLabels: Record<string, string> = {
  report_submitted: "Report",
  report_reviewed: "Review",
  report_accepted: "Accepted",
  report_rejected: "Rejected",
  report_feedback: "Feedback",
  deadline: "Deadline",
  internship: "Internship",
  profile: "Profile",
  announcement: "Announcement",
  company: "Directory",
  general: "General",
};

interface NotificationPanelProps {
  audience: NotificationAudience;
  userId?: string;
}

export function NotificationPanel({ audience, userId }: NotificationPanelProps) {
  const {
    getNotificationsFor,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();
  const [selected, setSelected] = useState<AppNotification | null>(null);

  const items = getNotificationsFor(audience, userId);
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="lg"
          aria-label="Notifications"
          className="text-text-secondary"
        >
          <Badge content={unread} color="danger" size="sm" isInvisible={unread === 0}>
            <Bell size={20} />
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notifications"
        className="max-h-[min(70vh,480px)] w-[min(100vw-2rem,380px)] overflow-y-auto rounded-card border border-border bg-surface-card p-0 font-sans shadow-card"
        emptyContent={
          <p className="px-4 py-8 text-center text-sm text-text-secondary">No notifications</p>
        }
        topContent={
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-base font-semibold text-text-primary">Notifications</p>
            {unread > 0 && (
              <Button
                size="sm"
                variant="light"
                startContent={<CheckCheck size={14} />}
                onPress={() => markAllNotificationsRead(audience, userId)}
              >
                Mark all read
              </Button>
            )}
          </div>
        }
      >
        {items.map((n) => (
          <DropdownItem
            key={n.id}
            textValue={n.title}
            className={cn("px-0", !n.read && "bg-primary/5")}
            onPress={() => {
              markNotificationRead(n.id);
              setSelected({ ...n, read: true });
            }}
          >
            <NotificationRow notification={n} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
    <AppModal
      isOpen={!!selected}
      onClose={() => setSelected(null)}
      title={selected?.title ?? "Notification"}
      footer={<Button variant="light" onPress={() => setSelected(null)}>Close</Button>}
    >
      {selected && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold uppercase text-text-secondary">
              {categoryLabels[selected.category] ?? selected.category}
            </span>
            <span className="text-xs text-text-secondary">
              {formatDate(selected.createdAt)} - {new Date(selected.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
            {selected.message}
          </p>
        </div>
      )}
    </AppModal>
    </>
  );
}

function NotificationRow({ notification: n }: { notification: AppNotification }) {
  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-sm font-semibold text-text-primary", !n.read && "text-primary")}>
          {n.title}
        </p>
        {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
        {categoryLabels[n.category] ?? n.category}
      </p>
      <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{n.message}</p>
      <p className="mt-2 text-xs text-text-secondary">
        {formatDate(n.createdAt)} · {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
