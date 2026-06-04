"use client";

import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface PdfViewerProps {
  url?: string;
  fileName?: string;
  className?: string;
}

export function PdfViewer({ url, fileName, className }: PdfViewerProps) {
  if (!url) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-button border border-dashed border-border bg-surface-muted p-8 text-center",
          className
        )}
      >
        <FileText size={32} className="text-text-secondary" />
        <p className="mt-2 text-sm text-text-secondary">No PDF attached</p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-button border border-border/60 bg-white", className)}>
      {fileName && (
        <p className="border-b border-border/60 bg-surface-muted px-3 py-2 text-sm font-medium text-text-primary">
          {fileName}
        </p>
      )}
      <iframe
        title={fileName ?? "Report PDF"}
        src={url}
        className="h-[min(70vh,520px)] w-full min-h-[280px] bg-white sm:min-h-[360px]"
      />
    </div>
  );
}
