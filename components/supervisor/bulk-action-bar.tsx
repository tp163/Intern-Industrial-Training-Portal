"use client";

import { Button } from "@heroui/react";
import { Trash2, UserPlus } from "lucide-react";

interface BulkActionBarProps {
  count: number;
  onCancel: () => void;
}

export function BulkActionBar({ count, onCancel }: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 animate-slide-up">
      <div className="flex flex-col gap-4 rounded-card bg-primary px-5 py-4 text-white shadow-[0_8px_32px_rgba(61,46,38,0.25)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">
            {count} Student{count !== 1 ? "s" : ""} Selected
          </p>
          <p className="text-sm text-white/80">Modify assignments or update status in bulk</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="bordered"
            radius="lg"
            className="border-white/40 bg-transparent font-semibold text-white"
            onPress={onCancel}
          >
            Cancel
          </Button>
          <Button
            radius="lg"
            className="bg-white font-semibold text-primary"
            startContent={<UserPlus size={16} />}
          >
            Assign to Supervisor
          </Button>
          <Button
            isIconOnly
            radius="lg"
            variant="bordered"
            className="border-white/40 bg-transparent text-white"
            aria-label="Delete selected"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
