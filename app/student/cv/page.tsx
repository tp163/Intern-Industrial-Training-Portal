"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard } from "@/components/ui/page-header";
import { useAppStore } from "@/lib/store/app-store";
import { apiUploadFile } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { formatDate, MAX_CV_BYTES } from "@/lib/utils";
import { Button, Chip } from "@heroui/react";
import { CheckCircle, Download, FileText, Trash2, Upload } from "lucide-react";
import { getInitialCvFileName, setStoredCvFileName } from "@/lib/cv-storage";
import { useEffect, useRef, useState } from "react";

export default function StudentCvPage() {
  const { currentUser, getStudentById, updateStudentRecord } = useAppStore();
  const userId = currentUser?.id ?? "";
  const student = getStudentById(userId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    setFileName(
      getInitialCvFileName(student?.cvFileName ?? (student?.cvUrl ? "cv.pdf" : null))
    );
  }, [student?.cvFileName, student?.cvUrl]);
  const [uploading, setUploading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_CV_BYTES) {
      notifyError("CV must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const uploaded = await apiUploadFile(file);
      setFileName(file.name);
      setStoredCvFileName(file.name);
      setLastUpdated(new Date().toISOString().slice(0, 10));
      updateStudentRecord(
        userId,
        { cvFileName: file.name, cvUrl: uploaded.url },
        "CV document"
      );
      notifySuccess("CV uploaded successfully. Administrator has been notified.");
    } catch (err) {
      notifyError("Failed to upload CV: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    setStoredCvFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    updateStudentRecord(userId, { cvFileName: undefined, cvUrl: undefined }, "CV removal");
    notifySuccess("CV removed. Administrator has been notified.");
  };

  const handleDownload = () => {
    if (student?.cvUrl) {
      window.open(student.cvUrl, "_blank");
      notifySuccess("CV opened for download.");
    }
  };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="CV Management"
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
            className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-border bg-surface px-6 py-16 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="ds-icon-badge mb-4 h-16 w-16">
              <Upload size={28} />
            </div>
            <p className="text-lg font-semibold text-text-primary">Upload your CV</p>
            <p className="mt-1 text-center text-sm text-text-secondary">
              PDF, DOC, or DOCX — max 5MB. Required for all placement applications.
            </p>
            <Button
              color="primary"
              radius="lg"
              className="mt-6 font-semibold"
              isLoading={uploading}
              startContent={<Upload size={18} />}
              onPress={() => fileInputRef.current?.click()}
            >
              Upload CV
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="ds-list-item flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="ds-icon-badge h-12 w-12">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{fileName}</p>
                  <p className="text-sm text-text-secondary">
                    {lastUpdated ? `Last updated: ${formatDate(lastUpdated)}` : "Previously uploaded"}
                  </p>
                </div>
              </div>
              <Chip color="success" variant="flat" startContent={<CheckCircle size={14} />}>
                Active
              </Chip>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                color="primary"
                radius="lg"
                startContent={<Upload size={16} />}
                isLoading={uploading}
                onPress={() => fileInputRef.current?.click()}
              >
                Replace CV
              </Button>
              <Button
                variant="bordered"
                radius="lg"
                startContent={<Download size={16} />}
                onPress={handleDownload}
                isDisabled={!student?.cvUrl}
              >
                Download CV
              </Button>
              <Button
                variant="flat"
                color="danger"
                radius="lg"
                startContent={<Trash2 size={16} />}
                onPress={handleRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </ContentCard>
    </div>
  );
}
