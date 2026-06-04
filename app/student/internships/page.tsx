"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard, EmptyState } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { applications, currentStudent, departmentCategories, internships } from "@/data/mock";
import { notifyError, notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import type { Internship } from "@/types";
import {
  Button,
  Chip,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Briefcase, FileText, MapPin, Upload } from "lucide-react";
import { getInitialCvFileName, setStoredCvFileName } from "@/lib/cv-storage";
import { useEffect, useMemo, useRef, useState } from "react";

const typeOptions = [
  { key: "all", label: "All Types" },
  { key: "remote", label: "Remote" },
  { key: "onsite", label: "On-site" },
  { key: "hybrid", label: "Hybrid" },
];

const deptOptions = [
  { key: "all", label: "All Departments" },
  ...departmentCategories.map((d) => ({ key: d, label: d })),
];

export default function StudentInternshipsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selected, setSelected] = useState<Internship | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  useEffect(() => {
    setCvFileName(
      getInitialCvFileName(currentStudent.cvUrl ? "alex-morgan-cv.pdf" : null)
    );
  }, []);
  const [applying, setApplying] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [appliedIds, setAppliedIds] = useState(
    () => new Set(applications.filter((a) => a.studentId === currentStudent.id).map((a) => a.internshipId))
  );

  const openInternships = internships.filter((i) => i.status === "open");

  const filtered = useMemo(() => {
    return openInternships.filter((i) => {
      const matchesSearch =
        !search ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.companyName.toLowerCase().includes(search.toLowerCase()) ||
        i.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || i.type === typeFilter;
      const matchesDept =
        deptFilter === "all" || i.departmentCategory === deptFilter;
      return matchesSearch && matchesType && matchesDept;
    });
  }, [openInternships, search, typeFilter, deptFilter]);

  const handleApply = () => {
    if (!selected) return;
    if (!cvFileName) {
      notifyError("Please upload your CV before submitting the application.");
      return;
    }
    setApplying(true);
    setTimeout(() => {
      setAppliedIds((prev) => new Set([...prev, selected.id]));
      setApplying(false);
      setSelected(null);
      setCoverLetter("");
      notifySuccess("Application submitted successfully.");
    }, 900);
  };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Placements"
        description="Discover and apply to open internship opportunities"
      />

      <div className="flex flex-col gap-4 lg:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search internships..."
          className="flex-1"
        />
        <Select
          className="w-full sm:w-44"
          selectedKeys={[deptFilter]}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as string;
            if (val) setDeptFilter(val);
          }}
          variant="bordered"
          radius="lg"
          aria-label="Department category"
        >
          {deptOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Select
          className="w-full sm:w-44"
          selectedKeys={[typeFilter]}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0] as string;
            if (val) setTypeFilter(val);
          }}
          variant="bordered"
          radius="lg"
          aria-label="Filter by type"
        >
          {typeOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <ContentCard>
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No internships found"
            description="Try adjusting your search or filters."
          />
        </ContentCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((internship) => {
            const hasApplied = appliedIds.has(internship.id);
            return (
              <ContentCard key={internship.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{internship.title}</h3>
                      <p className="text-sm text-text-secondary">{internship.companyName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={internship.type} />
                      {internship.departmentCategory && (
                        <Chip size="sm" variant="flat">
                          {internship.departmentCategory}
                        </Chip>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {internship.location}
                    </span>
                    <span>·</span>
                    <span>{internship.duration}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-text-primary">{internship.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-text-secondary">
                      Deadline: {formatDate(internship.deadline)}
                    </p>
                    <Button
                      color="primary"
                      size="sm"
                      radius="lg"
                      isDisabled={hasApplied}
                      onPress={() => {
                        setSelected(internship);
                        setCoverLetter("");
                      }}
                    >
                      {hasApplied ? "Applied" : "Apply"}
                    </Button>
                  </div>
                </div>
              </ContentCard>
            );
          })}
        </div>
      )}

      <AppModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Apply: ${selected?.title ?? ""}`}
        footer={
          <>
            <Button variant="light" radius="lg" onPress={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              color="primary"
              radius="lg"
              isLoading={applying}
              onPress={handleApply}
            >
              Submit Application
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="rounded-button border border-border/60 bg-surface-muted p-4 text-sm text-text-secondary">
              <p className="font-semibold text-text-primary">Before you apply</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Upload an updated CV in PDF format (max 5MB).</li>
                <li>Ensure your contact details are current in your profile.</li>
                <li>Include a brief cover letter describing your interest.</li>
                <li>Required documents: CV, student ID verification (if requested).</li>
              </ul>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">CV Upload (required)</p>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCvFileName(file.name);
                    setStoredCvFileName(file.name);
                  }
                }}
              />
              {cvFileName ? (
                <div className="flex items-center justify-between rounded-button border border-border bg-white p-3">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <FileText size={16} className="text-primary" />
                    {cvFileName}
                  </span>
                  <Button size="sm" variant="flat" onPress={() => cvInputRef.current?.click()}>
                    Replace
                  </Button>
                </div>
              ) : (
                <Button
                  variant="bordered"
                  radius="lg"
                  className="w-full border-dashed"
                  startContent={<Upload size={16} />}
                  onPress={() => cvInputRef.current?.click()}
                >
                  Upload CV
                </Button>
              )}
            </div>

            <Textarea
              label="Cover Letter"
              placeholder="Tell us why you're a great fit for this role..."
              value={coverLetter}
              onValueChange={setCoverLetter}
              variant="bordered"
              radius="lg"
              minRows={4}
            />
          </div>
        )}
      </AppModal>
    </div>
  );
}
