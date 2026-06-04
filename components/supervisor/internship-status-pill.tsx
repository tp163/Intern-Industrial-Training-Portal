"use client";

import { cn } from "@/lib/utils";
import type { InternshipPlacementStatus } from "@/types";

const statusConfig: Record<
  InternshipPlacementStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  active: {
    label: "Active",
    dot: "bg-[#4CAF50]",
    text: "text-[#2E7D32]",
    bg: "bg-[#E8F5E9]",
  },
  pending: {
    label: "Pending",
    dot: "bg-[#FF9800]",
    text: "text-[#E65100]",
    bg: "bg-[#FFF3E0]",
  },
  not_placed: {
    label: "Not Placed",
    dot: "bg-danger",
    text: "text-danger",
    bg: "bg-[#FCEAEA]",
  },
};

interface InternshipStatusPillProps {
  status: InternshipPlacementStatus;
}

export function InternshipStatusPill({ status }: InternshipStatusPillProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
