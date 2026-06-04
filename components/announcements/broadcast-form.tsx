"use client";

import type { AnnouncementAuthorRole, AnnouncementPriority, AnnouncementTarget } from "@/types";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useState } from "react";

export interface BroadcastFormValues {
  title: string;
  message: string;
  priority: AnnouncementPriority;
  target: AnnouncementTarget;
  linkUrl: string;
  attachmentName: string;
  scheduledAt: string;
  category: "workshop" | "general" | "internship" | "deadline" | "reminder";
}

const emptyValues: BroadcastFormValues = {
  title: "",
  message: "",
  priority: "normal",
  target: "all_students",
  linkUrl: "",
  attachmentName: "",
  scheduledAt: "",
  category: "general",
};

interface BroadcastFormProps {
  authorRole: AnnouncementAuthorRole;
  supervisorId?: string;
  supervisors?: { id: string; name: string }[];
  onSubmit: (values: BroadcastFormValues, targetSupervisorId?: string) => void;
  submitting?: boolean;
}

export function BroadcastForm({
  authorRole,
  supervisorId,
  supervisors = [],
  onSubmit,
  submitting,
}: BroadcastFormProps) {
  const [form, setForm] = useState(emptyValues);
  const [targetSupervisorId, setTargetSupervisorId] = useState("");

  const handleSubmit = () => {
    if (!form.title.trim() || !form.message.trim()) return;
    if (
      authorRole === "admin" &&
      form.target === "supervisor_students" &&
      !targetSupervisorId
    ) {
      return;
    }
    onSubmit(form, authorRole === "admin" ? targetSupervisorId : supervisorId);
    setForm(emptyValues);
    setTargetSupervisorId("");
  };

  return (
    <div className="space-y-4">
      <Input
        label="Title"
        value={form.title}
        onValueChange={(v) => setForm((f) => ({ ...f, title: v }))}
        variant="bordered"
        radius="lg"
        isRequired
      />
      <Textarea
        label="Message"
        value={form.message}
        onValueChange={(v) => setForm((f) => ({ ...f, message: v }))}
        variant="bordered"
        radius="lg"
        minRows={5}
        isRequired
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Priority"
          selectedKeys={[form.priority]}
          onSelectionChange={(keys) => {
            const v = Array.from(keys)[0] as AnnouncementPriority;
            if (v) setForm((f) => ({ ...f, priority: v }));
          }}
          variant="bordered"
          radius="lg"
        >
          <SelectItem key="normal">Normal</SelectItem>
          <SelectItem key="important">Important</SelectItem>
          <SelectItem key="urgent">Urgent</SelectItem>
        </Select>
        <Select
          label="Category"
          selectedKeys={[form.category]}
          onSelectionChange={(keys) => {
            const v = Array.from(keys)[0] as BroadcastFormValues["category"];
            if (v) setForm((f) => ({ ...f, category: v }));
          }}
          variant="bordered"
          radius="lg"
        >
          <SelectItem key="general">General</SelectItem>
          <SelectItem key="workshop">Workshop</SelectItem>
          <SelectItem key="internship">Internship</SelectItem>
          <SelectItem key="deadline">Deadline</SelectItem>
          <SelectItem key="reminder">Reminder</SelectItem>
        </Select>
      </div>
      {authorRole === "admin" ? (
        <>
          <Select
            label="Audience"
            selectedKeys={[form.target]}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0] as AnnouncementTarget;
              if (v) setForm((f) => ({ ...f, target: v }));
            }}
            variant="bordered"
            radius="lg"
          >
            <SelectItem key="all_students">All Students</SelectItem>
            <SelectItem key="supervisor_students">Students of Selected Supervisor</SelectItem>
          </Select>
          {form.target === "supervisor_students" && (
            <Select
              label="Supervisor"
              placeholder="Select supervisor"
              selectedKeys={targetSupervisorId ? [targetSupervisorId] : []}
              onSelectionChange={(keys) =>
                setTargetSupervisorId((Array.from(keys)[0] as string) ?? "")
              }
              variant="bordered"
              radius="lg"
            >
              {supervisors.map((s) => (
                <SelectItem key={s.id}>{s.name}</SelectItem>
              ))}
            </Select>
          )}
        </>
      ) : (
        <p className="rounded-button border border-border/60 bg-surface-muted p-3 text-sm text-text-secondary">
          This broadcast will be sent to your assigned students only.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Link URL (optional)"
          placeholder="https://..."
          value={form.linkUrl}
          onValueChange={(v) => setForm((f) => ({ ...f, linkUrl: v }))}
          variant="bordered"
          radius="lg"
        />
        <Input
          label="Attachment name (optional)"
          placeholder="e.g. workshop-guide.pdf"
          value={form.attachmentName}
          onValueChange={(v) => setForm((f) => ({ ...f, attachmentName: v }))}
          variant="bordered"
          radius="lg"
        />
      </div>
      <Input
        type="datetime-local"
        label="Schedule for later (optional)"
        value={form.scheduledAt}
        onValueChange={(v) => setForm((f) => ({ ...f, scheduledAt: v }))}
        variant="bordered"
        radius="lg"
        description="Leave empty to publish immediately"
      />
      <div className="flex justify-end border-t border-border pt-4">
        <Button
          color="primary"
          radius="lg"
          isLoading={submitting}
          isDisabled={!form.title.trim() || !form.message.trim()}
          onPress={handleSubmit}
        >
          Publish Broadcast
        </Button>
      </div>
    </div>
  );
}
