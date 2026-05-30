"use client";

import { Chip } from "@heroui/react";
import { capitalize, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  return (
    <Chip color={getStatusColor(status)} variant="flat" size={size}>
      {capitalize(status)}
    </Chip>
  );
}
