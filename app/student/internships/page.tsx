"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard, EmptyState } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { applications, currentStudent, internships } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import type { Internship } from "@/types";
import {
  Button,
  Chip,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Briefcase, MapPin, Send } from "lucide-react";
import { useMemo, useState } from "react";

const typeOptions = [
  { key: "all", label: "All Types" },
  { key: "remote", label: "Remote" },
  { key: "onsite", label: "On-site" },
  { key: "hybrid", label: "Hybrid" },
];

export default function StudentInternshipsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<Internship | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
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
      return matchesSearch && matchesType;
    });
  }, [openInternships, search, typeFilter]);

  const handleApply = () => {
    if (!selected) return;
    setApplying(true);
    setTimeout(() => {
      setAppliedIds((prev) => new Set([...prev, selected.id]));
      setApplying(false);
      setSelected(null);
      setCoverLetter("");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Placements"
        description="Discover and apply to open internship opportunities"
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search internships..."
          className="flex-1"
        />
        <Select
          className="w-full sm:w-44"
          selectedKeys={[typeFilter]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            if (selected) setTypeFilter(selected);
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
            description="Try adjusting your search or check back later for new postings."
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
                    <StatusBadge status={internship.type} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {internship.location}
                    </span>
                    <span>·</span>
                    <span>{internship.duration}</span>
                    {internship.stipend && (
                      <>
                        <span>·</span>
                        <span>{internship.stipend}</span>
                      </>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm text-text-primary">{internship.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {internship.requirements.slice(0, 4).map((req) => (
                      <Chip key={req} size="sm" variant="flat">
                        {req}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-text-secondary">
                      Deadline: {formatDate(internship.deadline)} · {internship.slots} slots ·{" "}
                      {internship.applied} applied
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
              startContent={<Send size={18} />}
              isLoading={applying}
              onPress={handleApply}
            >
              Submit Application
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              {selected.companyName} · {selected.location}
            </p>
            <Textarea
              label="Cover Letter"
              placeholder="Tell us why you're a great fit for this role..."
              value={coverLetter}
              onValueChange={setCoverLetter}
              variant="bordered"
              radius="lg"
              minRows={5}
            />
          </div>
        )}
      </AppModal>
    </div>
  );
}
