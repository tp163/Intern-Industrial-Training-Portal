"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableScroll } from "@/components/ui/table-scroll";
import { apiUpdateApplication, apiUpdateInternship, apiListTrainingRecords, apiUpdateTrainingRecord } from "@/lib/api";
import { departmentOptions, normalizeDepartments } from "@/lib/departments";
import { notifyError, notifySuccess } from "@/lib/notify";
import { authFetch } from "@/lib/auth-fetch";
import { useAppStore } from "@/lib/store/app-store";
import { capitalize, formatDate, formFieldClassNames, isFutureDate, isPositiveInteger } from "@/lib/utils";
import type { Application, ApplicationStatus, Internship } from "@/types";
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Briefcase, Eye, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const typeOptions = [
  { key: "remote", label: "Remote" },
  { key: "hybrid", label: "Hybrid" },
  { key: "onsite", label: "On-site" },
] as const;
type DepartmentOption = (typeof departmentOptions)[number];
type PostForm = {
  title: string;
  companyId: string;
  companyName: string;
  location: string;
  duration: string;
  slots: string;
  deadline: string;
  type: Internship["type"];
  departmentCategories: DepartmentOption[];
};

function mapInternship(row: Record<string, unknown>): Internship {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    companyId: String(row.company_id ?? row.companyId ?? ""),
    companyName: String(row.company_name ?? row.companyName ?? ""),
    location: String(row.location ?? ""),
    type: (row.type as Internship["type"]) ?? "onsite",
    duration: String(row.duration ?? ""),
    deadline: String((row.deadline as string ?? "").slice(0, 10)),
    description: String(row.description ?? ""),
    requirements: Array.isArray(row.requirements) ? (row.requirements as string[]) : [],
    slots: Number(row.slots ?? 0),
    applied: Number(row.applied ?? 0),
    status: (row.status as Internship["status"]) ?? "open",
    stipend: row.stipend ? String(row.stipend) : undefined,
    departmentCategories: normalizeDepartments(row.department_categories ?? row.department_category),
    departmentCategory: normalizeDepartments(row.department_categories ?? row.department_category)[0],
  };
}

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "draft", label: "Draft" },
];

const emptyPostForm: PostForm = {
  title: "",
  companyId: "",
  companyName: "",
  location: "",
  duration: "3 months",
  slots: "1",
  deadline: "",
  type: "onsite" as Internship["type"],
  departmentCategories: ["CMIS"],
};

export default function AdminInternshipsPage() {
  const { applications, companies, loadRealData } = useAppStore();
  const [items, setItems] = useState<Internship[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPost, setShowPost] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState(emptyPostForm);
  const [saving, setSaving] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<ApplicationStatus | null>(null);
  const [activeTab, setActiveTab] = useState<"opportunities" | "proposed">("opportunities");
  const [proposedPlacements, setProposedPlacements] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    authFetch(`${API_BASE}/internships`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setItems((res.data ?? []).map(mapInternship));
      })
      .catch(() => {});
    loadRealData();
    apiListTrainingRecords("placement_confirmations").then((result) => setProposedPlacements(result.data)).catch(() => {});
  }, [loadRealData]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        i.title.toLowerCase().includes(q) ||
        i.companyName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handlePost = async () => {
    if (!postForm.title.trim() || !postForm.companyId || !postForm.companyName.trim()) {
      notifyError("Title and a company from the Company Directory are required.");
      return;
    }
    if (!isPositiveInteger(postForm.slots)) {
      notifyError("Slots must be at least 1.");
      return;
    }
    if (postForm.departmentCategories.length === 0) {
      notifyError("Select at least one department.");
      return;
    }
    if (!isFutureDate(postForm.deadline)) {
      notifyError("Internship deadline must be today or a future date.");
      return;
    }
    setSaving(true);
    try {
      const existingInternship = editingId ? items.find((item) => item.id === editingId) : undefined;
      const payload = {
        company_id: postForm.companyId,
        company_name: postForm.companyName,
        title: postForm.title,
        description: existingInternship?.description ?? "New internship listing.",
        location: postForm.location || "TBD",
        type: postForm.type,
        duration: postForm.duration,
        slots: Number(postForm.slots) || 1,
        applied: existingInternship?.applied ?? 0,
        deadline: new Date(postForm.deadline).toISOString(),
        status: existingInternship?.status ?? "open",
        requirements: existingInternship?.requirements ?? ["CV required"],
        department_categories: postForm.departmentCategories,
      };
      const response = await authFetch(
        editingId ? `${API_BASE}/internships/${editingId}` : `${API_BASE}/internships`,
        {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to post internship");
      const savedInternship = mapInternship(result.data);
      setItems((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? savedInternship : item))
          : [savedInternship, ...prev]
      );
      setShowPost(false);
      setEditingId(null);
      setPostForm(emptyPostForm);
      notifySuccess(editingId ? "Internship updated successfully." : "Internship posted successfully.");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to post internship.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (internship: Internship) => {
    setEditingId(internship.id);
    setPostForm({
      title: internship.title,
      companyId:
        internship.companyId ||
        companies.find((company) => company.name === internship.companyName)?.id ||
        "",
      companyName: internship.companyName,
      location: internship.location,
      duration: internship.duration,
      slots: String(internship.slots),
      deadline: internship.deadline,
      type: internship.type,
      departmentCategories: internship.departmentCategories?.length
        ? internship.departmentCategories
        : internship.departmentCategory
          ? [internship.departmentCategory]
          : ["CMIS"],
    });
    setShowPost(true);
  };

  const closePostModal = () => {
    setShowPost(false);
    setEditingId(null);
    setPostForm(emptyPostForm);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await authFetch(`${API_BASE}/internships/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to delete internship");
      setItems((prev) => prev.filter((i) => i.id !== id));
      notifySuccess("Internship listing removed.");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to delete internship.");
    }
  };

  const internshipApplications = selectedInternship
    ? applications.filter((application) => application.internshipId === selectedInternship.id)
    : [];

  const approvePlacement = async (id: string) => {
    try {
      await apiUpdateTrainingRecord("placement_confirmations", id, { status: "approved", reviewed_at: new Date().toISOString() });
      setProposedPlacements((current) => current.map((item) => String(item.id) === id ? { ...item, status: "approved" } : item));
      notifySuccess("Student-proposed placement approved.");
    } catch (error) { notifyError(error instanceof Error ? error.message : "Failed to approve placement."); }
  };

  const updateStatus = async (status: ApplicationStatus) => {
    if (!selectedApplication) return;
    setUpdatingStatus(status);
    try {
      const updatedApplication = {
        ...selectedApplication,
        status,
      };
      const nextApplications = applications.map((application) =>
        application.id === selectedApplication.id ? updatedApplication : application
      );
      const nextApprovedCount = nextApplications.filter(
        (application) =>
          application.internshipId === selectedApplication.internshipId &&
          application.status === "approved"
      ).length;

      await apiUpdateApplication(selectedApplication.id, { status });
      await apiUpdateInternship(selectedApplication.internshipId, {
        applied: nextApprovedCount,
      });
      await loadRealData();
      setSelectedApplication((prev) => (prev ? { ...prev, status } : prev));
      setItems((prev) =>
        prev.map((internship) =>
          internship.id === selectedApplication.internshipId
            ? { ...internship, applied: nextApprovedCount }
            : internship
        )
      );
      setSelectedInternship((prev) =>
        prev && prev.id === selectedApplication.internshipId
          ? { ...prev, applied: nextApprovedCount }
          : prev
      );
      notifySuccess(`Application marked as ${status}.`);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Failed to update application status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Internships"
        description={`${items.length} internship listings`}
        action={
          <Button color="primary" radius="lg" startContent={<Plus size={16} />} onPress={() => setShowPost(true)}>
            Post Internship
          </Button>
        }
      />

      <div className="flex gap-1 rounded-xl border border-border/60 bg-surface-muted p-1"><Button variant={activeTab === "opportunities" ? "solid" : "light"} color={activeTab === "opportunities" ? "primary" : "default"} onPress={() => setActiveTab("opportunities")}>Internship Opportunities</Button><Button variant={activeTab === "proposed" ? "solid" : "light"} color={activeTab === "proposed" ? "primary" : "default"} onPress={() => setActiveTab("proposed")}>Student-Proposed Placements</Button></div>

      {activeTab === "proposed" ? <ContentCard title="Student-Proposed Placements">{proposedPlacements.filter((item) => String(item.status ?? "") === "pending_approval" || String(item.status ?? "") === "submitted").length === 0 ? <p className="py-8 text-center text-sm text-text-secondary">No student-proposed placements awaiting approval.</p> : <TableScroll><Table aria-label="Student-proposed placements" removeWrapper><TableHeader><TableColumn>STUDENT</TableColumn><TableColumn>ORGANIZATION</TableColumn><TableColumn>DATES</TableColumn><TableColumn>STATUS</TableColumn><TableColumn>ACTIONS</TableColumn></TableHeader><TableBody>{proposedPlacements.filter((item) => ["pending_approval", "submitted"].includes(String(item.status ?? ""))).map((item) => <TableRow key={String(item.id)}><TableCell>{String(item.student_id)}</TableCell><TableCell>{String(item.organization ?? "—")}</TableCell><TableCell>{String(item.start_date ?? "—")} – {String(item.end_date ?? "—")}</TableCell><TableCell><Chip size="sm" variant="flat" color="warning">{String(item.status ?? "pending_approval")}</Chip></TableCell><TableCell><Button size="sm" color="success" onPress={() => void approvePlacement(String(item.id))}>Approve</Button></TableCell></TableRow>)}</TableBody></Table></TableScroll>}</ContentCard> : <ContentCard>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search internships..." className="flex-1" />
          <Select
            className="w-full sm:w-44"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              if (selected) setStatusFilter(selected);
            }}
            variant="bordered"
            radius="lg"
            aria-label="Filter by status"
          >
            {statusOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Briefcase size={28} />} title="No internships found" description="Adjust filters or post a new internship." />
        ) : (
          <TableScroll>
            <Table aria-label="Internships table" removeWrapper>
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>COMPANY</TableColumn>
                <TableColumn className="hidden sm:table-cell">TYPE</TableColumn>
                <TableColumn className="hidden md:table-cell">DEPARTMENT</TableColumn>
                <TableColumn>SLOTS</TableColumn>
                <TableColumn className="hidden md:table-cell">DEADLINE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filtered.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell><span className="font-medium">{internship.title}</span></TableCell>
                    <TableCell>{internship.companyName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{capitalize(internship.type)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {internship.departmentCategories?.length
                        ? internship.departmentCategories.join(", ")
                        : internship.departmentCategory ?? "All"}
                    </TableCell>
                    <TableCell>{internship.applied}/{internship.slots}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(internship.deadline)}</TableCell>
                    <TableCell><StatusBadge status={internship.status} /></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button isIconOnly size="sm" variant="light" aria-label="Edit" onPress={() => openEdit(internship)}>
                          <Pencil size={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" color="primary" aria-label="View applicants" onPress={() => setSelectedInternship(internship)}>
                          <Eye size={16} />
                        </Button>
                        <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Delete" onPress={() => handleDelete(internship.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScroll>
        )}
      </ContentCard>}

      <AppModal
        isOpen={showPost}
        onClose={closePostModal}
        title={editingId ? "Edit Internship" : "Post Internship"}
        footer={
          <>
            <Button variant="light" onPress={closePostModal}>Cancel</Button>
            <Button color="primary" isLoading={saving} onPress={handlePost}>{editingId ? "Save Changes" : "Publish"}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Job Title" value={postForm.title} onValueChange={(v) => setPostForm((f) => ({ ...f, title: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
          <Select
            label="Company"
            placeholder="Select a company"
            selectedKeys={postForm.companyId ? [postForm.companyId] : []}
            onSelectionChange={(keys) => {
              const companyId = Array.from(keys)[0] as string;
              const company = companies.find((item) => item.id === companyId);
              if (company) {
                setPostForm((form) => ({
                  ...form,
                  companyId: company.id,
                  companyName: company.name,
                }));
              }
            }}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          >
            {companies.map((company) => (
              <SelectItem key={company.id} textValue={company.name}>
                {company.name}
              </SelectItem>
            ))}
          </Select>
          <Input label="Location" value={postForm.location} onValueChange={(v) => setPostForm((f) => ({ ...f, location: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Select
            label="Department"
            selectionMode="multiple"
            selectedKeys={new Set(postForm.departmentCategories)}
            onSelectionChange={(keys) => {
              const values = Array.from(keys) as DepartmentOption[];
              setPostForm((f) => ({ ...f, departmentCategories: values }));
            }}
            variant="bordered"
            radius="lg"
          >
            {departmentOptions.map((department) => (
              <SelectItem key={department}>{department}</SelectItem>
            ))}
          </Select>
          <Select
            label="Internship Type"
            selectedKeys={[postForm.type]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as Internship["type"];
              if (value) setPostForm((f) => ({ ...f, type: value }));
            }}
            variant="bordered"
            radius="lg"
          >
            {typeOptions.map((type) => (
              <SelectItem key={type.key}>{type.label}</SelectItem>
            ))}
          </Select>
          <Input label="Duration" value={postForm.duration} onValueChange={(v) => setPostForm((f) => ({ ...f, duration: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Deadline" type="date" value={postForm.deadline} onValueChange={(v) => setPostForm((f) => ({ ...f, deadline: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} isInvalid={!!postForm.deadline && !isFutureDate(postForm.deadline)} errorMessage="Deadline cannot be in the past." />
          <Input label="Slots" type="number" min={1} value={postForm.slots} onValueChange={(v) => setPostForm((f) => ({ ...f, slots: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} isInvalid={!!postForm.slots && !isPositiveInteger(postForm.slots)} errorMessage="Slots must be at least 1." />
        </div>
      </AppModal>

      <AppModal
        isOpen={!!selectedInternship}
        onClose={() => {
          setSelectedInternship(null);
          setSelectedApplication(null);
        }}
        title={selectedInternship ? `Applicants: ${selectedInternship.title}` : "Applicants"}
        size="4xl"
        footer={<Button variant="light" onPress={() => setSelectedInternship(null)}>Close</Button>}
      >
        <div className="space-y-4">
          <Table aria-label="Internship applicants" removeWrapper>
            <TableHeader>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn>COMPANY</TableColumn>
              <TableColumn>APPLIED</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>UPLOADS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No students have applied for this internship yet.">
              {internshipApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.studentName}</TableCell>
                  <TableCell>{application.companyName}</TableCell>
                  <TableCell>{formatDate(application.appliedAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {application.cvUrl && <Chip size="sm" variant="flat">CV</Chip>}
                      {application.documentUrl && <Chip size="sm" variant="flat">Doc</Chip>}
                      {!application.cvUrl && !application.documentUrl && "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="flat" color="primary" onPress={() => setSelectedApplication(application)}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedApplication && (
            <div className="rounded-card border border-border/60 bg-surface-muted p-4">
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <DetailField label="Student" value={selectedApplication.studentName} />
                <DetailField label="Status" value={capitalize(selectedApplication.status)} />
                <DetailField label="Internship" value={selectedApplication.internshipTitle} />
                <DetailField label="Applied" value={formatDate(selectedApplication.appliedAt)} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-text-secondary">Cover Letter</p>
                <p className="mt-2 whitespace-pre-wrap rounded-button border border-border/60 bg-white p-3 text-sm leading-relaxed text-text-primary">
                  {selectedApplication.coverLetter || "No cover letter submitted."}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DocumentButton label="Open CV" url={selectedApplication.cvUrl} />
                <DocumentButton label={selectedApplication.documentFileName ?? "Open Other Document"} url={selectedApplication.documentUrl} />
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
                <Button
                  color="warning"
                  variant="flat"
                  isLoading={updatingStatus === "reviewing"}
                  onPress={() => updateStatus("reviewing")}
                >
                  Mark Reviewing
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  isLoading={updatingStatus === "rejected"}
                  onPress={() => updateStatus("rejected")}
                >
                  Reject
                </Button>
                <Button
                  color="success"
                  isLoading={updatingStatus === "approved"}
                  onPress={() => updateStatus("approved")}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </div>
      </AppModal>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function DocumentButton({ label, url }: { label: string; url?: string }) {
  return (
    <Button
      variant="bordered"
      radius="lg"
      startContent={<FileText size={16} />}
      isDisabled={!url}
      onPress={() => {
        if (url) window.open(url, "_blank");
      }}
    >
      {url ? label : `${label} unavailable`}
    </Button>
  );
}
