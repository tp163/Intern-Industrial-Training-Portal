"use client";

import { AnnouncementPriorityBadge } from "@/components/announcements/announcement-priority-badge";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/types";
import { ExternalLink, Paperclip, User } from "lucide-react";

export function AnnouncementCard({ announcement: a }: { announcement: Announcement }) {
  const isPersonalMessage = a.isPersonal && a.authorRole === "supervisor";
  
  return (
    <article className={`rounded-card border p-4 shadow-card sm:p-5 ${
      isPersonalMessage
        ? "border-primary/50 bg-primary/5"
        : "border-border/60 bg-white"
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-text-primary sm:text-lg">{a.title}</h3>
          {isPersonalMessage && (
            <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
              Personal Message
            </span>
          )}
        </div>
        <AnnouncementPriorityBadge priority={a.priority} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary sm:text-sm">
        <span className="inline-flex items-center gap-1">
          <User size={14} />
          {a.authorName} ({a.authorRole})
        </span>
        <span>{formatDate(a.publishedAt ?? a.createdAt)}</span>
        <span className="capitalize">{a.category}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-primary sm:text-base">{a.message}</p>
      {(a.linkUrl || a.attachmentName) && (
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {a.attachmentName && (a.attachmentUrl || a.linkUrl) ? (
            <a
              href={a.attachmentUrl ?? a.linkUrl}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <Paperclip size={14} />
              {a.attachmentName}
            </a>
          ) : a.attachmentName ? (
            <span className="inline-flex items-center gap-1 text-text-secondary">
              <Paperclip size={14} />
              {a.attachmentName}
            </span>
          ) : null}
          {a.linkUrl && a.linkUrl !== a.attachmentUrl && (
            <a
              href={a.linkUrl}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              target={a.linkUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              View link
            </a>
          )}
        </div>
      )}
    </article>
  );
}
