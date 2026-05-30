"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard } from "@/components/ui/page-header";
import { currentStudent } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import { Button, Chip } from "@heroui/react";
import { CheckCircle, FileText, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function StudentCvPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(
    currentStudent.cvUrl ? "sarah-johnson-cv.pdf" : null
  );
  const [uploading, setUploading] = useState(false);
  const [lastUpdated] = useState("2025-04-10");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setFileName(file.name);
      setUploading(false);
    }, 1000);
  };

  const handleRemove = () => {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Assessments"
        description="Upload and manage your curriculum vitae for internship applications"
      />

      <ContentCard>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleUpload}
        />

        {!fileName ? (
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-border bg-surface px-6 py-16 transition-colors hover:border-primary hover:bg-primary/5"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="ds-icon-badge mb-4 h-16 w-16">
              <Upload size={28} />
            </div>
            <p className="text-lg font-semibold text-text-primary">Upload your CV</p>
            <p className="mt-1 text-sm text-text-secondary">PDF, DOC, or DOCX — max 5MB</p>
            <Button
              color="primary"
              variant="flat"
              radius="lg"
              className="mt-6"
              isLoading={uploading}
              onPress={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
          </div>
        ) : (
          <div className="ds-list-item flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="ds-icon-badge h-12 w-12">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-medium text-text-primary">{fileName}</p>
                <p className="text-sm text-text-secondary">
                  Last updated: {formatDate(lastUpdated)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Chip
                color="success"
                variant="flat"
                startContent={<CheckCircle size={14} />}
              >
                Active
              </Chip>
              <Button
                variant="flat"
                color="primary"
                radius="lg"
                isLoading={uploading}
                onPress={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
              <Button
                variant="flat"
                color="danger"
                radius="lg"
                isIconOnly
                aria-label="Remove CV"
                onPress={handleRemove}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        )}
      </ContentCard>
    </div>
  );
}
