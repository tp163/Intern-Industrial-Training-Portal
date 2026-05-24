"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
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
      <PageHeader
        title="CV / Resume"
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
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-default-300 bg-default-50 px-6 py-16 transition-colors hover:border-primary hover:bg-primary/5"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Upload size={28} />
            </div>
            <p className="text-lg font-semibold">Upload your CV</p>
            <p className="mt-1 text-sm text-default-500">PDF, DOC, or DOCX — max 5MB</p>
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-default-200 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-medium">{fileName}</p>
                <p className="text-sm text-default-500">
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
