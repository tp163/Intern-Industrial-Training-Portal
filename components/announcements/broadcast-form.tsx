"use client";

import type { AnnouncementAuthorRole, AnnouncementPriority, AnnouncementTarget } from "@/types";
import { apiUploadFile } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { MAX_UPLOAD_BYTES } from "@/lib/utils";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FileText, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export interface BroadcastFormValues {
  title: string;
  message: string;
  priority: AnnouncementPriority;
  target: AnnouncementTarget;
  linkUrl: string;
  attachmentName: string;
  attachmentUrl: string;
  scheduledAt: string;
  category: "workshop" | "general" | "internship" | "deadline" | "reminder";
  selectedStudentIds?: string[];
}

const emptyValues: BroadcastFormValues = {
  title: "",
  message: "",
  priority: "normal",
  target: "all_students",
  linkUrl: "",
  attachmentName: "",
  attachmentUrl: "",
  scheduledAt: "",
  category: "general",
};

interface BroadcastFormProps {
  authorRole: AnnouncementAuthorRole;
  supervisorId?: string;
  supervisors?: { id: string; name: string }[];
  students?: { id: string; name: string; studentId?: string }[];
  onSubmit: (values: BroadcastFormValues, targetSupervisorId?: string) => void;
  submitting?: boolean;
}

export function BroadcastForm({
  authorRole,
  supervisorId,
  supervisors = [],
  students = [],
  onSubmit,
  submitting,
}: BroadcastFormProps) {
  const [form, setForm] = useState(emptyValues);
  const [targetSupervisorId, setTargetSupervisorId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [studentSearch, setStudentSearch] = useState("");
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    return [...students]
      .filter((student) =>
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.studentId?.toLowerCase().includes(query)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, studentSearch]);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.message.trim()) return;
    if (form.title.trim().length > 100 || form.message.trim().length > 1000) return;
    if (form.scheduledAt && new Date(form.scheduledAt) < new Date()) return;
    if (
      authorRole === "admin" &&
      form.target === "supervisor_students" &&
      !targetSupervisorId
    ) {
      return;
    }
    if (
      (authorRole === "admin" || authorRole === "supervisor") &&
      form.target === "specific_students" &&
      selectedStudentIds.size === 0
    ) {
      return;
    }
    onSubmit(
      { ...form, selectedStudentIds: Array.from(selectedStudentIds) },
      authorRole === "admin" ? targetSupervisorId : supervisorId
    );
    setForm(emptyValues);
    setTargetSupervisorId("");
    setSelectedStudentIds(new Set());
    setStudentSearch("");
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
  };

  const handleAttachmentUpload = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      notifyError("Attachment must be 10MB or smaller.");
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
      return;
    }
    setUploadingAttachment(true);
    try {
      const uploaded = await apiUploadFile(file);
      setForm((f) => ({
        ...f,
        attachmentName: file.name,
        attachmentUrl: uploaded.url,
      }));
      notifySuccess("Attachment uploaded.");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to upload attachment.");
    } finally {
      setUploadingAttachment(false);
    }
  };

  const clearAttachment = () => {
    setForm((f) => ({ ...f, attachmentName: "", attachmentUrl: "" }));
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
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
        maxLength={100}
        isInvalid={form.title.length > 100}
        errorMessage="Title must be 100 characters or fewer."
      />
      <Textarea
        label="Message"
        value={form.message}
        onValueChange={(v) => setForm((f) => ({ ...f, message: v }))}
        variant="bordered"
        radius="lg"
        minRows={5}
        isRequired
        maxLength={1000}
        isInvalid={form.message.length > 1000}
        errorMessage="Message must be 1000 characters or fewer."
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
              if (v) {
                setForm((f) => ({ ...f, target: v }));
                setSelectedStudentIds(new Set());
                setStudentSearch("");
              }
            }}
            variant="bordered"
            radius="lg"
          >
            <SelectItem key="all_students">All Students</SelectItem>
            <SelectItem key="supervisor_students">Students of Selected Supervisor</SelectItem>
            <SelectItem key="specific_students">Specific Students</SelectItem>
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
          {form.target === "specific_students" && (
            <div className="space-y-3">
              <Input
                label="Search Students"
                placeholder="Search by name or student ID..."
                value={studentSearch}
                onValueChange={setStudentSearch}
                variant="bordered"
                radius="lg"
              />
              <Select
                label="Select Students"
                placeholder="Select students..."
              selectedKeys={selectedStudentIds}
              onSelectionChange={(keys) =>
                setSelectedStudentIds(
                  keys === "all" ? new Set(students.map((student) => student.id)) : new Set(Array.from(keys).map(String))
                )
              }
              variant="bordered"
              radius="lg"
              selectionMode="multiple"
              classNames={{
                popoverContent: "max-h-72",
              }}
            >
              {filteredStudents.map((s) => (
                  <SelectItem key={s.id} textValue={`${s.name} ${s.studentId || ""}`}>
                    {s.name} {s.studentId ? `(${s.studentId})` : ""}
                  </SelectItem>
              ))}
              </Select>
            </div>
          )}
        </>
      ) : (
        <>
          <Select
            label="Audience"
            selectedKeys={[form.target]}
            onSelectionChange={(keys) => {
              const v = Array.from(keys)[0] as AnnouncementTarget;
              if (v) {
                setForm((f) => ({ ...f, target: v }));
                setSelectedStudentIds(new Set());
                setStudentSearch("");
              }
            }}
            variant="bordered"
            radius="lg"
          >
            <SelectItem key="all_students">All Assigned Students</SelectItem>
            <SelectItem key="specific_students">Specific Students</SelectItem>
          </Select>
          {form.target === "specific_students" && (
            <div className="space-y-3">
              <Input
                label="Search Students"
                placeholder="Search by name or student ID..."
                value={studentSearch}
                onValueChange={setStudentSearch}
                variant="bordered"
                radius="lg"
              />
              <Select
                label="Select Students"
                placeholder="Select Students..."
              selectedKeys={selectedStudentIds}
              onSelectionChange={(keys) =>
                setSelectedStudentIds(
                  keys === "all" ? new Set(students.map((student) => student.id)) : new Set(Array.from(keys).map(String))
                )
              }
              variant="bordered"
              radius="lg"
              selectionMode="multiple"
              classNames={{
                popoverContent: "max-h-72",
              }}
            >
              {filteredStudents.map((s) => (
                  <SelectItem key={s.id} textValue={`${s.name} ${s.studentId || ""}`}>
                    {s.name} {s.studentId ? `(${s.studentId})` : ""}
                  </SelectItem>
              ))}
              </Select>
            </div>
          )}
        </>
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
        <div className="rounded-button border border-border/70 bg-white p-3">
          <input
            ref={attachmentInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png,.txt,.csv,.xlsx,.xls"
            onChange={(event) => handleAttachmentUpload(event.target.files?.[0])}
          />
          <p className="mb-2 text-sm font-medium text-text-primary">Attachment (optional)</p>
          {form.attachmentName ? (
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex min-w-0 items-center gap-2 text-sm text-text-primary">
                <FileText size={16} className="shrink-0 text-primary" />
                <span className="truncate">{form.attachmentName}</span>
              </span>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="flat" isLoading={uploadingAttachment} onPress={() => attachmentInputRef.current?.click()}>
                  Replace
                </Button>
                <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Remove attachment" onPress={clearAttachment}>
                  <X size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full border-dashed"
              variant="bordered"
              radius="lg"
              startContent={<Upload size={16} />}
              isLoading={uploadingAttachment}
              onPress={() => attachmentInputRef.current?.click()}
            >
              Upload Attachment
            </Button>
          )}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-text-primary">Schedule for later (optional)</p>
        <Input
          type="datetime-local"
          labelPlacement="outside"
          value={form.scheduledAt}
          onValueChange={(v) => setForm((f) => ({ ...f, scheduledAt: v }))}
          placeholder="Leave empty to publish immediately"
          variant="bordered"
          radius="lg"
          isInvalid={!!form.scheduledAt && new Date(form.scheduledAt) < new Date()}
          errorMessage="Scheduled date cannot be in the past."
        />
      </div>
      <div className="flex justify-end border-t border-border pt-4">
        <Button
          color="primary"
          radius="lg"
          isLoading={submitting}
          isDisabled={
            !form.title.trim() ||
            !form.message.trim() ||
            form.title.trim().length > 100 ||
            form.message.trim().length > 1000 ||
            (!!form.scheduledAt && new Date(form.scheduledAt) < new Date())
          }
          onPress={handleSubmit}
        >
          Publish Broadcast
        </Button>
      </div>
    </div>
  );
}
