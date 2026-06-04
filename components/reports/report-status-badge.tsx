"use client";

import { cn } from "@/lib/utils";
import type { LogbookReportStatus } from "@/types";

const config: Record<
  LogbookReportStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#FFF3E0] text-[#E65100]",
  },
  unreviewed: {
    label: "Unreviewed",
    className: "bg-surface-muted text-text-secondary",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-[#E3F2FD] text-[#1565C0]",
  },
  accepted: {
    label: "Accepted",
    className: "bg-[#E8F5E9] text-[#2E7D32]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#FFEBEE] text-[#C62828]",
  },
};

export function ReportStatusBadge({
  status,
  className,
}: {
  status: LogbookReportStatus;
  className?: string;
}) {
  const { label, className: statusClass } = config[status];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        statusClass,
        className
      )}
    >
      {label}
    </span>
  );
}
