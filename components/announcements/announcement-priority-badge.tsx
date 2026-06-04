"use client";

import { cn } from "@/lib/utils";
import type { AnnouncementPriority } from "@/types";

const styles: Record<AnnouncementPriority, string> = {
  normal: "bg-surface-muted text-text-secondary",
  important: "bg-[#FFF3E0] text-[#E65100]",
  urgent: "bg-[#FFEBEE] text-[#C62828]",
};

export function AnnouncementPriorityBadge({ priority }: { priority: AnnouncementPriority }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[priority]
      )}
    >
      {priority}
    </span>
  );
}
