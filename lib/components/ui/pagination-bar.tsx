"use client";

import { Pagination } from "@heroui/react";

interface PaginationBarProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

export function PaginationBar({ page, total, onChange, className }: PaginationBarProps) {
  if (total <= 1) return null;

  return (
    <div className={className}>
      <Pagination
        page={page}
        total={total}
        onChange={onChange}
        showControls
        color="primary"
        variant="flat"
        radius="lg"
      />
    </div>
  );
}
