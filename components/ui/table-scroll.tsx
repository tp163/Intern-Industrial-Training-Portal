"use client";

import { cn } from "@/lib/utils";

/** Horizontal scroll wrapper for data tables on small screens */
export function TableScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0", className)}>
      <div className="min-w-[640px]">{children}</div>
    </div>
  );
}
