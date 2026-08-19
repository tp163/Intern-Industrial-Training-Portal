# Intern Industrial Training Portal - Project Code Review Bundle

Generated for a full GPT code review. Third-party dependencies, lockfiles, build output, and generated folders are excluded so the reviewer can focus on project code.

## Project File List

- `app/admin/broadcast/page.tsx`
- `app/admin/companies/page.tsx`
- `app/admin/dashboard/page.tsx`
- `app/admin/internships/page.tsx`
- `app/admin/layout.tsx`
- `app/admin/reports/page.tsx`
- `app/admin/settings/page.tsx`
- `app/admin/student-allocation/page.tsx`
- `app/admin/students/page.tsx`
- `app/admin/students-from-db/page.tsx`
- `app/admin/supervisors/page.tsx`
- `app/admin/supervisor-student-directory/page.tsx`
- `app/forgot-password/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/login/page.tsx`
- `app/page.tsx`
- `app/register/page.tsx`
- `app/student/announcements/page.tsx`
- `app/student/applications/page.tsx`
- `app/student/companies/page.tsx`
- `app/student/cv/page.tsx`
- `app/student/dashboard/page.tsx`
- `app/student/internships/page.tsx`
- `app/student/layout.tsx`
- `app/student/profile/page.tsx`
- `app/student/reports/page.tsx`
- `app/supervisor/broadcast/page.tsx`
- `app/supervisor/companies/page.tsx`
- `app/supervisor/dashboard/page.tsx`
- `app/supervisor/layout.tsx`
- `app/supervisor/reports/page.tsx`
- `app/supervisor/reviews/page.tsx`
- `app/supervisor/settings/page.tsx`
- `app/supervisor/students/page.tsx`
- `app/supervisor/supervisors/page.tsx`
- `backend/package.json`
- `backend/README.md`
- `backend/sql/create_all_tables.sql`
- `backend/src/announcements/announcements.controller.js`
- `backend/src/announcements/announcements.routes.js`
- `backend/src/applications/applications.controller.js`
- `backend/src/applications/applications.routes.js`
- `backend/src/auth/auth.controller.js`
- `backend/src/auth/auth.middleware.js`
- `backend/src/auth/auth.routes.js`
- `backend/src/companies/companies.controller.js`
- `backend/src/companies/companies.routes.js`
- `backend/src/config/supabase.js`
- `backend/src/internships/internships.controller.js`
- `backend/src/internships/internships.routes.js`
- `backend/src/logbook_reports/logbook_reports.controller.js`
- `backend/src/logbook_reports/logbook_reports.routes.js`
- `backend/src/notifications/notifications.controller.js`
- `backend/src/notifications/notifications.routes.js`
- `backend/src/progress_reports/progress_reports.controller.js`
- `backend/src/progress_reports/progress_reports.routes.js`
- `backend/src/reviews/reviews.controller.js`
- `backend/src/reviews/reviews.routes.js`
- `backend/src/server.js`
- `backend/src/students/students.controller.js`
- `backend/src/students/students.routes.js`
- `backend/src/system_settings/system_settings.controller.js`
- `backend/src/system_settings/system_settings.routes.js`
- `backend/src/test-insert-student-direct.js`
- `backend/src/test-supabase.js`
- `backend/src/test-supabase-connection.js`
- `backend/src/test-supabase-insert.js`
- `backend/src/test-supabase-select.js`
- `backend/src/uploads/uploads.controller.js`
- `backend/src/uploads/uploads.routes.js`
- `backend/src/users/users.controller.js`
- `backend/src/users/users.routes.js`
- `components/announcements/announcement-card.tsx`
- `components/announcements/announcement-priority-badge.tsx`
- `components/announcements/broadcast-form.tsx`
- `components/auth/auth-layout.tsx`
- `components/companies/company-directory-view.tsx`
- `components/layout/app-header.tsx`
- `components/layout/dashboard-layout.tsx`
- `components/layout/navbar.tsx`
- `components/layout/portal-navbar.tsx`
- `components/layout/sidebar.tsx`
- `components/notifications/notification-panel.tsx`
- `components/providers.tsx`
- `components/reports/pdf-viewer.tsx`
- `components/reports/report-status-badge.tsx`
- `components/student/portal-page-header.tsx`
- `components/supervisor/bulk-action-bar.tsx`
- `components/supervisor/internship-status-pill.tsx`
- `components/ui/app-modal.tsx`
- `components/ui/dynamic-icon.tsx`
- `components/ui/page-header.tsx`
- `components/ui/pagination-bar.tsx`
- `components/ui/search-bar.tsx`
- `components/ui/stat-card.tsx`
- `components/ui/status-badge.tsx`
- `components/ui/table-scroll.tsx`
- `components/ui/theme-toggle.tsx`
- `data/mock.ts`
- `database/README.md`
- `lib/api.ts`
- `lib/components/auth/auth-layout.tsx`
- `lib/components/layout/dashboard-layout.tsx`
- `lib/components/layout/navbar.tsx`
- `lib/components/layout/sidebar.tsx`
- `lib/components/providers.tsx`
- `lib/components/student/portal-page-header.tsx`
- `lib/components/ui/app-modal.tsx`
- `lib/components/ui/dynamic-icon.tsx`
- `lib/components/ui/page-header.tsx`
- `lib/components/ui/pagination-bar.tsx`
- `lib/components/ui/search-bar.tsx`
- `lib/components/ui/stat-card.tsx`
- `lib/components/ui/status-badge.tsx`
- `lib/components/ui/theme-toggle.tsx`
- `lib/cv-storage.ts`
- `lib/mock-api.ts`
- `lib/navigation.ts`
- `lib/notify.ts`
- `lib/session.ts`
- `lib/settings.ts`
- `lib/store/app-store.tsx`
- `lib/store/initial-announcements.ts`
- `lib/supabase.ts`
- `lib/utils.ts`
- `next.config.ts`
- `package.json`
- `postcss.config.mjs`
- `README.md`
- `tailwind.config.ts`
- `tsconfig.json`
- `types/index.ts`

## Source Files

### `app/admin/broadcast/page.tsx`

~~~tsx
"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { BroadcastForm, type BroadcastFormValues } from "@/components/announcements/broadcast-form";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { currentAdmin } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminBroadcastPage() {
  const { supervisors, publishAnnouncement, getAllAnnouncements } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const announcements = getAllAnnouncements().filter((a) => a.authorRole === "admin");

  const handlePublish = async (values: BroadcastFormValues, targetSupervisorId?: string) => {
    setSubmitting(true);
    try {
      const newAnnouncement = {
        title: values.title,
        message: values.message,
        priority: values.priority,
        target: values.target,
        author_id: currentAdmin.id,
        author_name: currentAdmin.name,
        author_role: "admin",
        supervisor_id: values.target === "supervisor_students" ? targetSupervisorId : null,
        link_url: values.linkUrl || null,
        attachment_name: values.attachmentName || null,
        scheduled_at: values.scheduledAt
          ? new Date(values.scheduledAt).toISOString()
          : null,
        category: values.category,
      };

      const response = await fetch(`${API_BASE}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create announcement");
      }

      publishAnnouncement({
        ...values,
        authorId: currentAdmin.id,
        authorName: currentAdmin.name,
        authorRole: "admin",
        id: result.data.id,
        createdAt: result.data.created_at,
      } as any);

      notifySuccess(
        !values.scheduledAt
          ? "Broadcast published. Students have been notified."
          : "Broadcast scheduled for future publication."
      );
    } catch (err: any) {
      console.error(err);
      alert("Failed to publish broadcast: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast"
        description="Send announcements to all students or to students under a specific supervisor"
      />

      <ContentCard title="Create Broadcast">
        <BroadcastForm
          authorRole="admin"
          supervisors={supervisors.map((s) => ({ id: s.id, name: s.name }))}
          onSubmit={handlePublish}
          submitting={submitting}
        />
      </ContentCard>

      <ContentCard title="Published & Scheduled">
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-sm text-text-secondary">No broadcasts yet.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="space-y-2">
                <AnnouncementCard announcement={a} />
                <p className="text-xs text-text-secondary">
                  {a.publishedAt
                    ? `Published ${formatDate(a.publishedAt)}`
                    : a.scheduledAt
                      ? `Scheduled ${formatDate(a.scheduledAt)}`
                      : "Draft"}
                  {" Â· "}
                  Target: {a.target === "all_students" ? "All students" : "Supervisor group"}
                </p>
              </div>
            ))
          )}
        </div>
      </ContentCard>
    </div>
  );
}
~~~

### `app/admin/companies/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { internships } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import { formatDate, formFieldClassNames } from "@/lib/utils";
import type { Company } from "@/types";
import {
  Button,
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
import { Briefcase, Building2, FileText, Plus, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const emptyForm = {
  name: "",
  industry: "",
  location: "",
  email: "",
  phone: "",
  description: "",
  status: "approved" as Company["status"],
};

export default function AdminCompaniesPage() {
  const { companies, addCompany, removeCompany } = useAppStore();
  const [search, setSearch] = useState("");
  const [viewCompany, setViewCompany] = useState<Company | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const letterInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        (c.companyLetter?.toLowerCase().includes(q) ?? false)
    );
  }, [companies, search]);

  const handleAdd = () => {
    addCompany({
      ...form,
      website: undefined,
      logo: undefined,
      companyLetter: letterFile ? letterFile.name : undefined,
    });
    notifySuccess("Company added. Student and supervisor directories updated.");
    setShowAdd(false);
    setForm(emptyForm);
    setLetterFile(null);
  };

  const companyInternships = useMemo(() => {
    if (!viewCompany) return [];
    return internships.filter((i) => i.companyId === viewCompany.id);
  }, [viewCompany]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Directory"
        description="Manage the central company directory â€” changes sync to student and supervisor portals"
        action={
          <Button color="primary" radius="lg" startContent={<Plus size={16} />} onPress={() => setShowAdd(true)}>
            Add Company
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search companies..."
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 size={28} />}
            title="No companies found"
            description="Try adjusting your search."
          />
        ) : (
        <TableScroll>
        <Table aria-label="Companies table" removeWrapper>
          <TableHeader>
            <TableColumn>COMPANY</TableColumn>
            <TableColumn>COMPANY LETTER</TableColumn>
            <TableColumn>INDUSTRY</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn>REGISTERED</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>INTERNSHIPS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {filtered.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-xs text-text-secondary">{company.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {company.companyLetter ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                      <FileText size={14} />
                      {company.companyLetter}
                    </span>
                  ) : (
                    <span className="text-sm text-text-secondary">â€”</span>
                  )}
                </TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell>{formatDate(company.createdAt)}</TableCell>
                <TableCell className="capitalize">{company.status}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    radius="lg"
                    startContent={<Briefcase size={14} />}
                    onPress={() => setViewCompany(company)}
                  >
                    View Internships
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    aria-label="Remove company"
                    onPress={() => {
                      removeCompany(company.id);
                      notifySuccess("Company removed from directory.");
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableScroll>
        )}
      </ContentCard>

      <AppModal
        isOpen={!!viewCompany}
        onClose={() => setViewCompany(null)}
        title={viewCompany ? `Internships â€” ${viewCompany.name}` : "Internships"}
        footer={
          <Button variant="light" radius="lg" onPress={() => setViewCompany(null)}>
            Close
          </Button>
        }
      >
        {companyInternships.length === 0 ? (
          <p className="text-sm text-text-secondary">No internship listings for this company.</p>
        ) : (
          <ul className="space-y-3">
            {companyInternships.map((job) => (
              <li
                key={job.id}
                className="rounded-button border border-border/60 bg-surface-muted p-4"
              >
                <p className="font-semibold text-text-primary">{job.title}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  {job.location} Â· {job.duration} Â· {job.status}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Deadline: {formatDate(job.deadline)} Â· {job.applied}/{job.slots} applied
                </p>
              </li>
            ))}
          </ul>
        )}
      </AppModal>

      <AppModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Company"
        footer={
          <>
            <Button variant="light" onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button color="primary" onPress={handleAdd}>Add Company</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Company Name" value={form.name} onValueChange={(v) => setForm((f) => ({ ...f, name: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
          <Input label="Industry" value={form.industry} onValueChange={(v) => setForm((f) => ({ ...f, industry: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Location" value={form.location} onValueChange={(v) => setForm((f) => ({ ...f, location: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Email" value={form.email} onValueChange={(v) => setForm((f) => ({ ...f, email: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Phone" value={form.phone} onValueChange={(v) => setForm((f) => ({ ...f, phone: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <div>
            <p className="mb-2 text-sm font-medium text-text-primary">Company Letter (PDF)</p>
            <input
              ref={letterInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => setLetterFile(e.target.files?.[0] ?? null)}
            />
            {letterFile ? (
              <div className="flex items-center justify-between rounded-button border border-border bg-surface-muted p-3">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <FileText size={15} className="text-primary" />
                  {letterFile.name}
                </span>
                <Button size="sm" variant="flat" onPress={() => letterInputRef.current?.click()}>
                  Replace
                </Button>
              </div>
            ) : (
              <Button
                variant="bordered"
                radius="lg"
                className="w-full border-dashed"
                startContent={<Upload size={15} />}
                onPress={() => letterInputRef.current?.click()}
              >
                Upload Company Letter PDF
              </Button>
            )}
          </div>
          <Select label="Status" selectedKeys={[form.status]} onSelectionChange={(keys) => { const v = Array.from(keys)[0] as Company["status"]; if (v) setForm((f) => ({ ...f, status: v })); }} variant="bordered" radius="lg">
            <SelectItem key="approved">Approved</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="rejected">Rejected</SelectItem>
          </Select>
          <Input label="Description" value={form.description} onValueChange={(v) => setForm((f) => ({ ...f, description: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
        </div>
      </AppModal>
    </div>
  );
}
~~~

### `app/admin/dashboard/page.tsx`

~~~tsx
"use client";

import { adminFacultyDashboard } from "@/data/mock";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const severityDot = {
  danger: "bg-danger",
  warning: "bg-warning",
};

export default function AdminDashboardPage() {
  const {
    title,
    subtitle,
    totalStudents,
    departments,
    activeInternships,
    pendingReviews,
    actionRequired,
  } = adminFacultyDashboard;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">{subtitle}</p>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-6 shadow-card md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Total Students
        </p>
        <p className="mt-2 text-4xl font-bold text-text-primary md:text-5xl">
          {totalStudents.toLocaleString()}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-4">
          {departments.map((dept) => (
            <div key={dept.name}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {dept.name}
              </p>
              <p className="mt-1 text-xl font-bold text-text-primary">{dept.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-card bg-primary p-6 text-white shadow-card">
          <p className="text-sm font-medium opacity-90">Active Internships</p>
          <p className="mt-2 text-4xl font-bold">{activeInternships.value.toLocaleString()}</p>
          <p className="mt-4 text-sm opacity-90">{activeInternships.trend}</p>
        </div>

        <div
          className="rounded-card p-6 text-white shadow-card"
          style={{ backgroundColor: "#9B4D4D" }}
        >
          <p className="text-sm font-medium opacity-90">Pending Reviews</p>
          <p className="mt-2 text-4xl font-bold">{pendingReviews.value}</p>
          <p className="mt-4 text-sm opacity-90">{pendingReviews.detail}</p>
        </div>

        <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle size={18} className="text-primary" />
            <h2 className="font-semibold text-text-primary">Action Required</h2>
          </div>
          <ul className="space-y-4">
            {actionRequired.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group flex items-start justify-between gap-3 rounded-button p-2 transition-colors hover:bg-surface-muted"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary group-hover:text-primary">
                      {item.label}
                    </p>
                    <p className="text-sm text-text-secondary">{item.detail}</p>
                  </div>
                  <span
                    className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", severityDot[item.severity])}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Button
            as={Link}
            href="/admin/reports"
            color="primary"
            radius="lg"
            className="mt-6 w-full font-semibold"
          >
            View All Tasks
          </Button>
        </div>
      </div>
    </div>
  );
}
~~~

### `app/admin/internships/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { TableScroll } from "@/components/ui/table-scroll";
import { StatusBadge } from "@/components/ui/status-badge";
import { internships as initialInternships } from "@/data/mock";
import { notifyError, notifySuccess } from "@/lib/notify";
import { capitalize, formatDate, formFieldClassNames } from "@/lib/utils";
import type { Internship } from "@/types";
import {
  Button,
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
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "draft", label: "Draft" },
];

const emptyPostForm = {
  title: "",
  companyName: "",
  location: "",
  duration: "3 months",
  slots: "1",
  type: "onsite" as Internship["type"],
};

export default function AdminInternshipsPage() {
  const [items, setItems] = useState(initialInternships);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPost, setShowPost] = useState(false);
  const [postForm, setPostForm] = useState(emptyPostForm);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        !search ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.companyName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handlePost = () => {
    if (!postForm.title.trim() || !postForm.companyName.trim()) {
      notifyError("Title and company name are required.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const entry: Internship = {
        id: `int-${Date.now()}`,
        companyId: "co-new",
        companyName: postForm.companyName,
        title: postForm.title,
        description: "New internship listing.",
        location: postForm.location || "TBD",
        type: postForm.type,
        duration: postForm.duration,
        slots: Number(postForm.slots) || 1,
        applied: 0,
        deadline: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
        status: "open",
        requirements: ["CV required"],
      };
      setItems((prev) => [entry, ...prev]);
      setSaving(false);
      setShowPost(false);
      setPostForm(emptyPostForm);
      notifySuccess("Internship posted successfully.");
    }, 700);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    notifySuccess("Internship listing removed.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Internships"
        description={`${items.length} internship listings`}
        action={
          <Button
            color="primary"
            radius="lg"
            startContent={<Plus size={16} />}
            onPress={() => setShowPost(true)}
          >
            Post Internship
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search internships..."
            className="flex-1"
          />
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
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No internships found"
            description="Adjust filters or post a new internship."
          />
        ) : (
          <TableScroll>
            <Table aria-label="Internships table" removeWrapper>
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>COMPANY</TableColumn>
                <TableColumn className="hidden sm:table-cell">TYPE</TableColumn>
                <TableColumn>SLOTS</TableColumn>
                <TableColumn className="hidden md:table-cell">DEADLINE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filtered.map((internship) => (
                  <TableRow key={internship.id}>
                    <TableCell>
                      <span className="font-medium">{internship.title}</span>
                    </TableCell>
                    <TableCell>{internship.companyName}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {capitalize(internship.type)}
                    </TableCell>
                    <TableCell>
                      {internship.applied}/{internship.slots}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(internship.deadline)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={internship.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          aria-label="Edit"
                          onPress={() => notifySuccess("Edit form opened (demo).")}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label="Delete"
                          onPress={() => handleDelete(internship.id)}
                        >
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
      </ContentCard>

      <AppModal
        isOpen={showPost}
        onClose={() => setShowPost(false)}
        title="Post Internship"
        footer={
          <>
            <Button variant="light" onPress={() => setShowPost(false)}>
              Cancel
            </Button>
            <Button color="primary" isLoading={saving} onPress={handlePost}>
              Publish
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Job Title"
            value={postForm.title}
            onValueChange={(v) => setPostForm((f) => ({ ...f, title: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
            className="sm:col-span-2"
          />
          <Input
            label="Company"
            value={postForm.companyName}
            onValueChange={(v) => setPostForm((f) => ({ ...f, companyName: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
          <Input
            label="Location"
            value={postForm.location}
            onValueChange={(v) => setPostForm((f) => ({ ...f, location: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
          <Input
            label="Duration"
            value={postForm.duration}
            onValueChange={(v) => setPostForm((f) => ({ ...f, duration: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
          <Input
            label="Slots"
            type="number"
            min={1}
            value={postForm.slots}
            onValueChange={(v) => setPostForm((f) => ({ ...f, slots: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
        </div>
      </AppModal>
    </div>
  );
}
~~~

### `app/admin/layout.tsx`

~~~tsx
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { adminConsoleMeta } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { adminNavItems, roleLabels } from "@/lib/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { adminProfile, currentUser } = useAppStore();

  return (
    <DashboardLayout
      navItems={adminNavItems}
      roleLabel={roleLabels.admin}
      userName={currentUser?.name ?? adminProfile.name}
      userEmail={currentUser?.email ?? adminProfile.email}
      profileHref="/admin/settings"
      variant="portal"
      userRoleBadge="Faculty Admin"
      consoleTitle={adminConsoleMeta.consoleTitle}
      consoleVersion={adminConsoleMeta.consoleVersion}
      notificationAudience="admin"
      notificationUserId={currentUser?.id}
    >
      {children}
    </DashboardLayout>
  );
}
~~~

### `app/admin/reports/page.tsx`

~~~tsx
"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { analyticsData, applications } from "@/data/mock";
import { capitalize } from "@/lib/utils";
import { Chip } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export default function AdminReportsPage() {
  const totalApplications = analyticsData.statusDistribution.reduce((s, i) => s + i.count, 0);
  const maxMonthly = Math.max(...analyticsData.monthlyApplications.map((d) => d.count));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        description="Detailed insights into platform activity"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ContentCard>
          <p className="text-sm text-text-secondary">Total Applications</p>
          <p className="mt-1 text-3xl font-bold">{totalApplications}</p>
        </ContentCard>
        <ContentCard>
          <p className="text-sm text-text-secondary">This Month</p>
          <p className="mt-1 text-3xl font-bold">
            {analyticsData.monthlyApplications.at(-1)?.count ?? 0}
          </p>
        </ContentCard>
        <ContentCard>
          <p className="text-sm text-text-secondary">Active Listings</p>
          <p className="mt-1 text-3xl font-bold">34</p>
        </ContentCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentCard title="Applications by Month">
          <div className="flex h-52 items-end justify-between gap-2">
            {analyticsData.monthlyApplications.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="flex w-full flex-col items-center justify-end"
                  style={{ height: "180px" }}
                >
                  <span className="mb-1 text-xs font-medium">{item.count}</span>
                  <div
                    className="w-full rounded-t-md bg-primary"
                    style={{
                      height: `${(item.count / maxMonthly) * 100}%`,
                      minHeight: "6px",
                    }}
                  />
                </div>
                <span className="text-xs text-text-secondary">{item.month}</span>
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard title="Status Breakdown">
          <div className="flex flex-wrap gap-3">
            {analyticsData.statusDistribution.map((item) => (
              <Chip
                key={item.status}
                variant="flat"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                {item.status}: {item.count}
              </Chip>
            ))}
          </div>
        </ContentCard>
      </div>

      <ContentCard title="Recent Applications">
        <Table aria-label="Recent applications" removeWrapper>
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>INTERNSHIP</TableColumn>
            <TableColumn>COMPANY</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.studentName}</TableCell>
                <TableCell>{app.internshipTitle}</TableCell>
                <TableCell>{app.companyName}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="primary">
                    {capitalize(app.status)}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentCard>

      <ContentCard title="Top Companies">
        <div className="space-y-4">
          {analyticsData.topCompanies.map((company, i) => {
            const max = analyticsData.topCompanies[0].applications;
            return (
              <div key={company.name} className="flex items-center gap-4">
                <span className="w-8 text-lg font-bold text-text-secondary/50">#{i + 1}</span>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between">
                    <span className="font-medium">{company.name}</span>
                    <span className="text-text-secondary">{company.applications} apps</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-sidebar">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(company.applications / max) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ContentCard>
    </div>
  );
}
~~~

### `app/admin/settings/page.tsx`

~~~tsx
"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { adminSettings } from "@/lib/settings";
import { currentAdmin } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import type { SystemSetting } from "@/types";
import {
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { Save, User } from "lucide-react";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminSettingsPage() {
  const { adminProfile, updateAdminProfile, updateCurrentUser } = useAppStore();
  const [settings, setSettings] = useState<SystemSetting[]>(adminSettings);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState(adminProfile);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await fetch(`${API_BASE}/users/${currentAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileForm.name, email: profileForm.email, phone: profileForm.phone }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to update profile");
    } catch {
      // backend may not be reachable; still update the store
    } finally {
      updateAdminProfile(profileForm);
      updateCurrentUser({ name: profileForm.name, email: profileForm.email, phone: profileForm.phone });
      notifySuccess("Profile updated successfully.");
      setSavingProfile(false);
    }
  };

  const updateSetting = (id: string, value: string | boolean | number) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Perform upsert for all settings
      const upsertPromises = settings.map(async (setting) => {
        const response = await fetch(`${API_BASE}/system_settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: setting.id,
            label: setting.label,
            description: setting.description,
            value: String(setting.value),
            type: setting.type,
            options: setting.options || null,
          }),
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to save setting");
        }
        return result;
      });

      await Promise.all(upsertPromises);
      notifySuccess("Settings saved successfully.");
    } catch (error: any) {
      console.error(error);
      alert("Failed to save settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and platform-wide configuration"
      />

      <ContentCard>
        <div className="mb-6 flex items-center gap-4">
          <Avatar
            name={getInitials(profileForm.name)}
            size="lg"
            className="h-16 w-16 text-lg"
            color="secondary"
          />
          <div>
            <p className="text-lg font-semibold text-text-primary">{profileForm.name}</p>
            <p className="text-sm text-text-secondary">{profileForm.title}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              value={profileForm.name}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, name: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              startContent={<User className="text-text-secondary" size={18} />}
              isRequired
            />
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, email: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isRequired
            />
            <Input
              label="Phone"
              value={profileForm.phone}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, phone: v }))}
              placeholder="e.g. +94 77 000 0000"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="Title / Role"
              value={profileForm.title}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, title: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              color="primary"
              radius="lg"
              startContent={<Save size={18} />}
              isLoading={savingProfile}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </ContentCard>

      <PageHeader
        title="System Settings"
        description="Configure platform-wide settings and preferences"
      />

      <form onSubmit={handleSave}>
        <ContentCard>
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex flex-col gap-3 border-b border-border pb-6 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="max-w-md">
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-text-secondary">{setting.description}</p>
                </div>

                <div className="w-full sm:w-64">
                  {setting.type === "boolean" && (
                    <Switch
                      isSelected={setting.value as boolean}
                      onValueChange={(v) => updateSetting(setting.id, v)}
                      color="primary"
                    />
                  )}
                  {setting.type === "number" && (
                    <Input
                      type="number"
                      value={String(setting.value)}
                      onValueChange={(v) => updateSetting(setting.id, Number(v) || 0)}
                      variant="bordered"
                      radius="lg"
                    />
                  )}
                  {setting.type === "text" && (
                    <Input
                      value={String(setting.value)}
                      onValueChange={(v) => updateSetting(setting.id, v)}
                      variant="bordered"
                      radius="lg"
                    />
                  )}
                  {setting.type === "select" && setting.options && (
                    <Select
                      selectedKeys={[String(setting.value)]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        if (selected) updateSetting(setting.id, selected);
                      }}
                      variant="bordered"
                      radius="lg"
                    >
                      {setting.options.map((opt) => (
                        <SelectItem key={opt}>{opt}</SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end border-t border-border pt-6">
            <Button
              type="submit"
              color="primary"
              radius="lg"
              startContent={<Save size={18} />}
              isLoading={saving}
            >
              Save Settings
            </Button>
          </div>
        </ContentCard>
      </form>
    </div>
  );
}
~~~

### `app/admin/student-allocation/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { useAppStore } from "@/lib/store/app-store";
import { fetchStudentByStudentId } from "@/lib/mock-api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import type { Student } from "@/types";
import {
  Avatar,
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
import { Plus, UserCheck } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminStudentAllocationPage() {
  const { students, supervisors, allocateStudents, addStudent } = useAppStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetSupervisor, setTargetSupervisor] = useState("");
  const [allocating, setAllocating] = useState(false);

  // Add Student state
  const [showAdd, setShowAdd] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [addForm, setAddForm] = useState<Partial<Student>>({});
  const [saving, setSaving] = useState(false);

  const supervisorMap = Object.fromEntries(supervisors.map((s) => [s.id, s.name]));

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        (supervisorMap[s.supervisorId ?? ""]?.toLowerCase().includes(q) ?? false);
      const matchesFilter =
        filter === "all" ||
        (filter === "unassigned" && !s.supervisorId) ||
        (filter === "allocated" && !!s.supervisorId);
      return matchesSearch && matchesFilter;
    });
  }, [students, search, filter, supervisorMap]);

  const handleAllocate = () => {
    if (selected.size === 0) { notifyError("Select at least one student."); return; }
    if (!targetSupervisor) { notifyError("Select a supervisor to assign."); return; }
    setAllocating(true);
    setTimeout(() => {
      allocateStudents(Array.from(selected), targetSupervisor);
      setAllocating(false);
      setSelected(new Set());
      notifySuccess(`${selected.size} student(s) allocated successfully.`);
    }, 500);
  };

  const handleUnassign = () => {
    if (selected.size === 0) { notifyError("Select at least one student."); return; }
    setAllocating(true);
    setTimeout(() => {
      allocateStudents(Array.from(selected), null);
      setAllocating(false);
      setSelected(new Set());
      notifySuccess("Supervisor assignment removed for selected students.");
    }, 500);
  };

  const handleLookupStudent = async () => {
    setLookupError("");
    if (!lookupId.trim()) { setLookupError("Enter a Student ID to search."); return; }
    setLookupLoading(true);
    try {
      const found = await fetchStudentByStudentId(lookupId);
      if (!found) {
        setLookupError("Invalid Student ID. No matching record found.");
        setAddForm({});
        notifyError("Invalid Student ID. Please check and try again.");
        return;
      }
      const alreadyListed = students.some(
        (s) => s.studentId.toUpperCase() === found.studentId.toUpperCase()
      );
      if (alreadyListed) {
        setLookupError("This student is already in the directory.");
        setAddForm({});
        notifyError("Student is already listed in the directory.");
        return;
      }
      setAddForm({ ...found });
      notifySuccess("Student details loaded successfully.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!addForm.studentId || !addForm.name) {
      notifyError("Fetch student details before adding.");
      return;
    }
    setSaving(true);
    try {
      const newStudent = {
        id: crypto.randomUUID(),
        name: addForm.name,
        email: addForm.email,
        role: "student",
        student_id: addForm.studentId,
        department: addForm.department ?? addForm.departmentCode,
        batch: addForm.batch,
        program: addForm.program,
        phone: addForm.phone,
        supervisor_id: null,
        allocation_status: "unassigned",
        internship_status: "pending",
      };
      const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to add student");
      const s = result.data;
      const entry: Student = {
        id: s.id,
        name: s.name,
        email: s.email,
        role: "student",
        studentId: s.student_id ?? addForm.studentId!,
        program: s.program ?? addForm.program ?? "",
        year: addForm.year ?? 0,
        gpa: addForm.gpa,
        phone: s.phone ?? addForm.phone ?? "",
        department: s.department ?? addForm.department ?? "",
        departmentCode: s.department ?? addForm.departmentCode ?? "",
        batch: s.batch ?? addForm.batch ?? "",
        internshipStatus: "pending",
        supervisorId: undefined,
        createdAt: s.created_at ?? new Date().toISOString(),
        allocationStatus: "unassigned",
      } as unknown as Student;
      addStudent(entry);
      notifySuccess(`${entry.name} added. Select them below to assign a supervisor.`);
      resetAdd();
    } catch (err: any) {
      notifyError(err?.message ?? "Failed to add student");
    } finally {
      setSaving(false);
    }
  };

  const resetAdd = () => {
    setShowAdd(false);
    setLookupId("");
    setLookupError("");
    setAddForm({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Allocation"
        description="Add students and assign or reassign them to supervisors. Changes sync instantly across all portals."
        action={
          <Button color="primary" radius="lg" startContent={<Plus size={16} />} onPress={() => setShowAdd(true)}>
            Add Student
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end">
          <SearchBar value={search} onChange={setSearch} placeholder="Search students..." className="flex-1" />
          <Select
            className="w-full sm:w-48"
            label="Filter"
            selectedKeys={[filter]}
            onSelectionChange={(keys) => setFilter((Array.from(keys)[0] as string) ?? "all")}
            variant="bordered"
            radius="lg"
          >
            <SelectItem key="all">All Students</SelectItem>
            <SelectItem key="allocated">Allocated</SelectItem>
            <SelectItem key="unassigned">Unassigned</SelectItem>
          </Select>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-card border border-border/60 bg-surface-muted p-4 lg:flex-row lg:items-end">
          <Select
            label="Assign to Supervisor"
            placeholder="Select supervisor"
            selectedKeys={targetSupervisor ? [targetSupervisor] : []}
            onSelectionChange={(keys) => setTargetSupervisor((Array.from(keys)[0] as string) ?? "")}
            variant="bordered"
            radius="lg"
            className="flex-1"
          >
            {supervisors.map((s) => (
              <SelectItem key={s.id} textValue={s.name}>
                {s.name} ({s.assignedStudents} students)
              </SelectItem>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button
              color="primary" radius="lg"
              startContent={<UserCheck size={16} />}
              isLoading={allocating}
              isDisabled={selected.size === 0}
              onPress={handleAllocate}
            >
              Allocate ({selected.size})
            </Button>
            <Button
              variant="bordered" radius="lg"
              isLoading={allocating}
              isDisabled={selected.size === 0}
              onPress={handleUnassign}
            >
              Remove Assignment
            </Button>
          </div>
        </div>

        <TableScroll>
          <Table
            aria-label="Student allocation"
            removeWrapper
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={(keys) => {
              if (keys === "all") setSelected(new Set(filtered.map((s) => s.id)));
              else setSelected(new Set(Array.from(keys) as string[]));
            }}
          >
            <TableHeader>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn>STUDENT ID</TableColumn>
              <TableColumn className="hidden md:table-cell">DEPARTMENT</TableColumn>
              <TableColumn>SUPERVISOR</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={getInitials(student.name)} size="sm" getInitials={getInitials} />
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.departmentCode ?? "â€”"}</TableCell>
                  <TableCell>{student.supervisorId ? supervisorMap[student.supervisorId] ?? "â€”" : "â€”"}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={student.supervisorId ? "success" : "warning"}>
                      {student.allocationStatus ?? (student.supervisorId ? "allocated" : "unassigned")}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </ContentCard>

      <AppModal
        isOpen={showAdd}
        onClose={resetAdd}
        title="Add Student"
        footer={
          <>
            <Button variant="light" onPress={resetAdd}>Cancel</Button>
            <Button color="primary" isDisabled={!addForm.studentId} isLoading={saving} onPress={handleAddStudent}>
              Add to Directory
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Input
              label="Student ID"
              placeholder="e.g. ENG-2024-099 (registry demo)"
              value={lookupId}
              onValueChange={(v) => { setLookupId(v); setLookupError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleLookupStudent(); } }}
              variant="bordered"
              radius="lg"
              className="flex-1"
              classNames={formFieldClassNames}
              isInvalid={!!lookupError}
              errorMessage={lookupError}
            />
            <Button color="primary" radius="lg" isLoading={lookupLoading} onPress={handleLookupStudent}>
              Fetch Details
            </Button>
          </div>
          {addForm.studentId && (
            <div className="grid gap-4 rounded-button border border-border/60 bg-surface-muted p-4 sm:grid-cols-2">
              <Input label="Student Name" value={addForm.name ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Department" value={addForm.departmentCode ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Email" value={addForm.email ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Batch" value={addForm.batch ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Contact" value={addForm.phone ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
            </div>
          )}
        </div>
      </AppModal>
    </div>
  );
}
~~~

### `app/admin/students/page.tsx`

~~~tsx
import { redirect } from "next/navigation";

export default function AdminStudentsRedirectPage() {
  redirect("/admin/supervisor-student-directory");
}
~~~

### `app/admin/students-from-db/page.tsx`

~~~tsx
"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Student = {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  departmentCode?: string;
  batch?: string;
  created_at?: string;
};

export default function StudentsFromDbPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/users`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load students");
        }

        const mapped = (result.data || [])
          .filter((u: any) => u.role === "student")
          .map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          studentId: u.student_id,
          departmentCode: u.department,
          batch: u.batch,
          created_at: u.created_at
        }));

        if (mounted) setStudents(mapped);
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading students from databaseâ€¦</div>;
  if (error) return <div>Error loading students: {error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Students (from Supabase)</h1>
      <div>
        {students.length === 0 && <div>No students found in database.</div>}
        <ul className="space-y-2">
          {students.map((s) => (
            <li key={s.id} className="rounded border p-3">
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">{s.email}</div>
              <div className="text-xs text-gray-500">{s.studentId ?? "-"} Â· {s.departmentCode ?? "-"} Â· {s.batch ?? "-"}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
~~~

### `app/admin/supervisors/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { useAppStore } from "@/lib/store/app-store";
import { apiCreateUser, apiUpdateUser, apiDeleteUser } from "@/lib/api";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/notify";
import type { Supervisor } from "@/types";
import {
  Avatar,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Eye, Pencil, Plus, Trash2, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminSupervisorsPage() {
  const { supervisors, addSupervisor, updateSupervisor, removeSupervisor } = useAppStore();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Supervisor | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    department: "",
    phone: "",
  });

  const filtered = useMemo(() => {
    if (!search) return supervisors;
    const q = search.toLowerCase();
    return supervisors.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q)
    );
  }, [supervisors, search]);

  const openAdd = () => {
    setForm({ name: "", email: "", title: "", department: "", phone: "" });
    setShowAdd(true);
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      notifyError("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const result = await apiCreateUser({
        name: form.name,
        email: form.email,
        role: "supervisor",
        title: form.title || null,
        department: form.department || null,
        phone: form.phone || null,
      });
      const dbId = (result.data as Record<string, unknown>)?.id as string ?? `sup-${Date.now()}`;
      const newSup: Supervisor = {
        id: dbId,
        name: form.name,
        email: form.email,
        role: "supervisor",
        title: form.title,
        department: form.department,
        phone: form.phone,
        assignedStudents: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      addSupervisor(newSup);
      setShowAdd(false);
      notifySuccess("Supervisor added successfully.");
    } catch (err: unknown) {
      notifyError("Failed to add supervisor: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await apiUpdateUser(selected.id, {
        name: form.name,
        email: form.email,
        title: form.title || null,
        department: form.department || null,
        phone: form.phone || null,
      }).catch(() => {}); // mock IDs won't exist in DB â€” still update local
      updateSupervisor(selected.id, { ...form });
      notifySuccess("Supervisor updated.");
      closeDetail();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiDeleteUser(id).catch(() => {}); // mock IDs â€” silent fail
    } finally {
      removeSupervisor(id);
      setConfirmDeleteId(null);
      notifySuccess("Supervisor removed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor Management"
        description={`${supervisors.length} supervisors in the system`}
        action={
          <Button color="primary" radius="lg" startContent={<Plus size={16} />} onPress={openAdd}>
            Add Supervisor
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search supervisors..." />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<UserCheck size={28} />}
            title="No supervisors found"
            description="Try a different search or add a new supervisor."
          />
        ) : (
        <TableScroll>
        <Table aria-label="Supervisors table" removeWrapper>
          <TableHeader>
            <TableColumn>SUPERVISOR</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>DEPARTMENT</TableColumn>
            <TableColumn>STUDENTS</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {filtered.map((supervisor) => (
              <TableRow key={supervisor.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={getInitials(supervisor.name)} size="sm" color="secondary" />
                    <div>
                      <p className="font-medium">{supervisor.name}</p>
                      <p className="text-xs text-text-secondary">{supervisor.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{supervisor.title}</TableCell>
                <TableCell>{supervisor.department ?? "â€”"}</TableCell>
                <TableCell>{supervisor.assignedStudents}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      isIconOnly size="sm" variant="light" aria-label="View"
                      onPress={() => { setSelected(supervisor); setEditMode(false); }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      isIconOnly size="sm" variant="light" aria-label="Edit"
                      onPress={() => {
                        setSelected(supervisor);
                        setForm({
                          name: supervisor.name,
                          email: supervisor.email,
                          title: supervisor.title,
                          department: supervisor.department ?? "",
                          phone: supervisor.phone ?? "",
                        });
                        setEditMode(true);
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                    {confirmDeleteId === supervisor.id ? (
                      <>
                        <Button size="sm" color="danger" radius="lg" onPress={() => handleDelete(supervisor.id)}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="flat" radius="lg" onPress={() => setConfirmDeleteId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        isIconOnly size="sm" variant="light" color="danger" aria-label="Delete"
                        onPress={() => setConfirmDeleteId(supervisor.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableScroll>
        )}
      </ContentCard>

      <AppModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Supervisor"
        footer={
          <>
            <Button variant="light" onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button color="primary" isLoading={saving} onPress={handleAdd}>Create Supervisor</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" value={form.name} onValueChange={(v) => setForm((f) => ({ ...f, name: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Email" value={form.email} onValueChange={(v) => setForm((f) => ({ ...f, email: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Title" value={form.title} onValueChange={(v) => setForm((f) => ({ ...f, title: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Department" value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Phone" value={form.phone} onValueChange={(v) => setForm((f) => ({ ...f, phone: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
        </div>
      </AppModal>

      <AppModal
        isOpen={!!selected}
        onClose={closeDetail}
        title={editMode ? "Edit Supervisor" : "Supervisor Details"}
        footer={
          editMode ? (
            <>
              <Button variant="light" onPress={closeDetail}>Cancel</Button>
              <Button color="primary" isLoading={saving} onPress={handleSaveEdit}>Save</Button>
            </>
          ) : (
            <Button variant="light" onPress={closeDetail}>Close</Button>
          )
        }
      >
        {selected && (
          <div className="grid gap-4 sm:grid-cols-2">
            {editMode ? (
              <>
                <Input label="Name" value={form.name} onValueChange={(v) => setForm((f) => ({ ...f, name: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
                <Input label="Email" value={form.email} onValueChange={(v) => setForm((f) => ({ ...f, email: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
                <Input label="Title" value={form.title} onValueChange={(v) => setForm((f) => ({ ...f, title: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
                <Input label="Department" value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
              </>
            ) : (
              <>
                <p><span className="text-text-secondary">Name:</span> {selected.name}</p>
                <p><span className="text-text-secondary">Email:</span> {selected.email}</p>
                <p><span className="text-text-secondary">Title:</span> {selected.title}</p>
                <p><span className="text-text-secondary">Department:</span> {selected.department ?? "â€”"}</p>
                <p><span className="text-text-secondary">Students:</span> {selected.assignedStudents}</p>
              </>
            )}
          </div>
        )}
      </AppModal>
    </div>
  );
}
~~~

### `app/admin/supervisor-student-directory/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { TableScroll } from "@/components/ui/table-scroll";
import { InternshipStatusPill } from "@/components/supervisor/internship-status-pill";
import { currentAdmin } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { apiDeleteUser } from "@/lib/api";
import { notifySuccess } from "@/lib/notify";
import { getInitials } from "@/lib/utils";
import type { Student } from "@/types";
import {
  Avatar,
  Button,
  Chip,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ChevronDown, ChevronRight, Eye, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ALL = "all";

export default function AdminSupervisorStudentDirectoryPage() {
  const { students, supervisors, removeStudent } = useAppStore();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [batch, setBatch] = useState(ALL);
  const [supervisorFilter, setSupervisorFilter] = useState(ALL);
  const [expandedSupervisors, setExpandedSupervisors] = useState<Set<string>>(
    () => new Set(supervisors.map((s) => s.id))
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [confirmDeleteStudentId, setConfirmDeleteStudentId] = useState<string | null>(null);

  const canDelete = currentAdmin.permissions.includes("all");

  const departments = useMemo(
    () => [ALL, ...Array.from(new Set(students.map((s) => s.departmentCode).filter(Boolean)))],
    [students]
  );
  const batches = useMemo(
    () => [ALL, ...Array.from(new Set(students.map((s) => s.batch).filter(Boolean)))],
    [students]
  );

  const supervisorMap = Object.fromEntries(supervisors.map((s) => [s.id, s.name]));

  const supervisorFilterOptions = useMemo(
    () => [
      { key: ALL, label: "All Supervisors" },
      { key: "unassigned", label: "Unassigned" },
      ...supervisors.map((s) => ({ key: s.id, label: s.name })),
    ],
    []
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = search.toLowerCase();
      const supervisorName = student.supervisorId
        ? supervisorMap[student.supervisorId]?.toLowerCase() ?? ""
        : "";

      const matchesSearch =
        !search ||
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        (student.departmentCode?.toLowerCase().includes(q) ?? false) ||
        (student.batch?.toLowerCase().includes(q) ?? false) ||
        supervisorName.includes(q);

      const matchesDepartment =
        department === ALL || student.departmentCode === department;
      const matchesBatch = batch === ALL || student.batch === batch;
      const matchesSupervisor =
        supervisorFilter === ALL ||
        (supervisorFilter === "unassigned"
          ? !student.supervisorId
          : student.supervisorId === supervisorFilter);

      return matchesSearch && matchesDepartment && matchesBatch && matchesSupervisor;
    });
  }, [students, search, department, batch, supervisorFilter, supervisorMap]);

  const groupedBySupervisor = useMemo(() => {
    return supervisors.map((supervisor) => ({
      supervisor,
      students: filteredStudents.filter((s) => s.supervisorId === supervisor.id),
    }));
  }, [filteredStudents]);

  const unassignedStudents = filteredStudents.filter((s) => !s.supervisorId);

  const toggleSupervisor = (id: string) => {
    setExpandedSupervisors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const closeModal = () => setSelectedStudent(null);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">
          Administration <span className="mx-1 text-text-secondary/60">&gt;</span> Supervisor Student
          Directory
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              Supervisor Student Directory
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              View all supervisors and students assigned to each supervisor across the faculty.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="flat" color="primary">
              {filteredStudents.length} students Â· {supervisors.length} supervisors
            </Chip>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-6">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={18}
            />
            <input
              type="search"
              placeholder="Search by Student ID, Name, Department, Batch, or Supervisor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-input border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Select
            aria-label="Department filter"
            selectedKeys={[department]}
            onSelectionChange={(keys) => setDepartment((Array.from(keys)[0] as string) ?? ALL)}
            variant="bordered"
            radius="lg"
            className="min-w-[150px]"
            classNames={{ trigger: "border-border bg-white" }}
          >
            {departments.map((d) => (
              <SelectItem key={d}>{d === ALL ? "All Departments" : d}</SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Batch filter"
            selectedKeys={[batch]}
            onSelectionChange={(keys) => setBatch((Array.from(keys)[0] as string) ?? ALL)}
            variant="bordered"
            radius="lg"
            className="min-w-[130px]"
            classNames={{ trigger: "border-border bg-white" }}
          >
            {batches.map((b) => (
              <SelectItem key={b}>{b === ALL ? "All Batches" : b}</SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Supervisor filter"
            items={supervisorFilterOptions}
            selectedKeys={[supervisorFilter]}
            onSelectionChange={(keys) =>
              setSupervisorFilter((Array.from(keys)[0] as string) ?? ALL)
            }
            variant="bordered"
            radius="lg"
            className="min-w-[180px]"
            classNames={{ trigger: "border-border bg-white" }}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No students match your filters</p>
          <p className="mt-1 text-sm text-text-secondary">Try adjusting search or filter options.</p>
        </div>
      )}

      <div className="space-y-4">
        {groupedBySupervisor.map(({ supervisor, students: assigned }) => {
          if (assigned.length === 0) return null;
          const isExpanded = expandedSupervisors.has(supervisor.id);

          return (
            <section
              key={supervisor.id}
              className="overflow-hidden rounded-card border border-border/60 bg-white shadow-card"
            >
              <button
                type="button"
                onClick={() => toggleSupervisor(supervisor.id)}
                className="flex w-full items-center justify-between gap-4 border-b border-border/60 bg-surface-muted/50 px-4 py-4 text-left sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown size={18} className="shrink-0 text-text-secondary" />
                  ) : (
                    <ChevronRight size={18} className="shrink-0 text-text-secondary" />
                  )}
                  <Avatar name={getInitials(supervisor.name)} size="sm" color="secondary" />
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary">{supervisor.name}</p>
                    <p className="text-xs text-text-secondary">
                      {supervisor.title} Â· {supervisor.department}
                    </p>
                  </div>
                </div>
                <Chip size="sm" variant="flat">
                  {assigned.length} student{assigned.length !== 1 ? "s" : ""}
                </Chip>
              </button>

              {isExpanded && (
                <TableScroll>
                  <Table aria-label={`Students for ${supervisor.name}`} removeWrapper>
                    <TableHeader>
                      <TableColumn>STUDENT</TableColumn>
                      <TableColumn>STUDENT ID</TableColumn>
                      <TableColumn>DEPARTMENT</TableColumn>
                      <TableColumn className="hidden sm:table-cell">BATCH</TableColumn>
                      <TableColumn className="hidden md:table-cell">STATUS</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {assigned.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar name={getInitials(student.name)} size="sm" color="primary" />
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-text-secondary">{student.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.departmentCode ?? "â€”"}</TableCell>
                          <TableCell className="hidden sm:table-cell">{student.batch ?? "â€”"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {student.internshipStatus ? (
                              <InternshipStatusPill status={student.internshipStatus} />
                            ) : (
                              "â€”"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button isIconOnly size="sm" variant="light" aria-label="View student" onPress={() => setSelectedStudent(student)}>
                                <Eye size={16} />
                              </Button>
                              {canDelete && confirmDeleteStudentId === student.id ? (
                                <>
                                  <Button size="sm" color="danger" radius="lg" onPress={async () => { await apiDeleteUser(student.id).catch(() => {}); removeStudent(student.id); setConfirmDeleteStudentId(null); notifySuccess("Student removed."); }}>Confirm</Button>
                                  <Button size="sm" variant="flat" radius="lg" onPress={() => setConfirmDeleteStudentId(null)}>Cancel</Button>
                                </>
                              ) : canDelete ? (
                                <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Delete student" onPress={() => setConfirmDeleteStudentId(student.id)}>
                                  <Trash2 size={16} />
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableScroll>
              )}
            </section>
          );
        })}

        {unassignedStudents.length > 0 && (
          <section className="overflow-hidden rounded-card border border-border/60 bg-white shadow-card">
            <div className="border-b border-border/60 bg-surface-muted/50 px-4 py-4 sm:px-6">
              <p className="font-semibold text-text-primary">Unassigned Students</p>
              <p className="text-xs text-text-secondary">Students without a supervisor</p>
            </div>
            <TableScroll>
              <Table aria-label="Unassigned students" removeWrapper>
                <TableHeader>
                  <TableColumn>STUDENT</TableColumn>
                  <TableColumn>STUDENT ID</TableColumn>
                  <TableColumn>DEPARTMENT</TableColumn>
                  <TableColumn>BATCH</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {unassignedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.departmentCode ?? "â€”"}</TableCell>
                      <TableCell>{student.batch ?? "â€”"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button isIconOnly size="sm" variant="light" aria-label="View student" onPress={() => setSelectedStudent(student)}>
                            <Eye size={16} />
                          </Button>
                          {canDelete && confirmDeleteStudentId === student.id ? (
                            <>
                              <Button size="sm" color="danger" radius="lg" onPress={async () => { await apiDeleteUser(student.id).catch(() => {}); removeStudent(student.id); setConfirmDeleteStudentId(null); notifySuccess("Student removed."); }}>Confirm</Button>
                              <Button size="sm" variant="flat" radius="lg" onPress={() => setConfirmDeleteStudentId(null)}>Cancel</Button>
                            </>
                          ) : canDelete ? (
                            <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Delete student" onPress={() => setConfirmDeleteStudentId(student.id)}>
                              <Trash2 size={16} />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableScroll>
          </section>
        )}
      </div>

      <AppModal
        isOpen={!!selectedStudent}
        onClose={closeModal}
        title="Student Details"
        footer={<Button variant="light" onPress={closeModal}>Close</Button>}
      >
        {selectedStudent && (
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Name" value={selectedStudent.name} />
            <DetailField label="Student ID" value={selectedStudent.studentId} />
            <DetailField label="Email" value={selectedStudent.email} />
            <DetailField label="Department" value={selectedStudent.departmentCode ?? "â€”"} />
            <DetailField label="Batch" value={selectedStudent.batch ?? "â€”"} />
            <DetailField label="Program" value={selectedStudent.program} />
            <DetailField
              label="Supervisor"
              value={selectedStudent.supervisorId ? supervisorMap[selectedStudent.supervisorId] ?? "â€”" : "Unassigned"}
            />
            <DetailField label="GPA" value={selectedStudent.gpa?.toString() ?? "â€”"} />
          </div>
        )}
      </AppModal>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
~~~

### `app/forgot-password/page.tsx`

~~~tsx
"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { formFieldClassNames } from "@/lib/utils";
import { Button, Input, Link } from "@heroui/react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {submitted ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="mt-2 text-sm text-text-secondary">
              We sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          <Button as={NextLink} href="/login" color="primary" variant="flat" radius="lg" className="w-full">
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onValueChange={setEmail}
            variant="bordered"
            radius="lg"
            isRequired
            classNames={formFieldClassNames}
          />

          <Button type="submit" color="primary" size="lg" radius="lg" className="w-full font-semibold" isLoading={loading}>
            Send Reset Link
          </Button>

          <Link as={NextLink} href="/login" size="sm" color="primary" className="flex items-center justify-center gap-1">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
~~~

### `app/globals.css`

~~~css
@import "tailwindcss";
@config "../tailwind.config.ts";

@layer base {
  html {
    scroll-behavior: smooth;
    font-size: 17px;
  }

  body {
    @apply bg-surface font-sans text-base text-text-primary antialiased;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
}

@layer components {
  .ds-card {
    @apply rounded-card border border-border/60 bg-white shadow-card;
  }

  .ds-card-hover {
    @apply transition-shadow hover:shadow-card-hover;
  }

  .ds-list-item {
    @apply rounded-button border border-border bg-surface-card p-4 transition-colors hover:bg-surface-sidebar/60;
  }

  .ds-icon-badge {
    @apply flex items-center justify-center rounded-button bg-primary/10 text-primary;
  }

  .ds-page-title {
    @apply font-sans text-[1.65rem] font-bold leading-tight tracking-tight text-text-primary md:text-[1.85rem];
  }

  .ds-page-description {
    @apply mt-1 font-sans text-base text-text-secondary;
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.4s ease-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
~~~

### `app/layout.tsx`

~~~tsx
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intern & Industrial Training System",
  description: "Manage internships, applications, and training progress",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
~~~

### `app/login/page.tsx`

~~~tsx
"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { roleDashboardPaths } from "@/lib/navigation";
import { formFieldClassNames } from "@/lib/utils";
import { Button, Input, Link, Select, SelectItem } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/types";
import { saveSession, mapDbUser } from "@/lib/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("authToken", result.token);
      }

      // Fetch full profile so all dashboard fields are available
      const profileRes = await fetch(`${API_BASE}/users/${result.user.id}`, {
        headers: { Authorization: `Bearer ${result.token}` },
      });
      const profileJson = await profileRes.json();
      const fullUser = profileJson.success ? profileJson.data : result.user;
      saveSession(mapDbUser({ ...result.user, ...fullUser }));

      const resultRole = (result.user?.role || role) as UserRole;
      router.push(roleDashboardPaths[resultRole]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleLogin} className="space-y-5">
        <Select
          label="Login as"
          selectedKeys={[role]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as UserRole;
            if (selected) setRole(selected);
          }}
          variant="bordered"
          radius="lg"
          classNames={formFieldClassNames}
        >
          <SelectItem key="student">Student</SelectItem>
          <SelectItem key="supervisor">Supervisor</SelectItem>
          <SelectItem key="admin">Administrator</SelectItem>
        </Select>

        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onValueChange={setEmail}
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onValueChange={setPassword}
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-secondary hover:text-text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link as={NextLink} href="/forgot-password" size="sm" color="primary">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" color="primary" size="lg" radius="lg" className="w-full font-semibold" isLoading={loading}>
            Sign In
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link as={NextLink} href="/register" size="sm" color="primary">
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
~~~

### `app/page.tsx`

~~~tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}
~~~

### `app/register/page.tsx`

~~~tsx
"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { roleDashboardPaths } from "@/lib/navigation";
import { formFieldClassNames } from "@/lib/utils";
import { Button, Input, Link, Select, SelectItem } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      const studentId = formData.get("studentId") as string;
      const department = formData.get("department") as string;

      if (!password) {
        alert("Please enter a password.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const payload = {
        name: `${firstName} ${lastName}`,
        email,
        password,
        role,
        student_id: role === "student" ? studentId : null,
        department: formData.get("department") as string || null,
        program: role === "student" ? formData.get("program") as string : null,
        year: role === "student" ? formData.get("year") as string : null,
        batch: role === "student" ? formData.get("batch") as string : null,
        title: role === "supervisor" ? formData.get("title") as string : null,
      };

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("Registration error:", JSON.stringify(result, null, 2));
        alert("Failed to register: " + (result.message || "Unable to register"));
      } else {
        router.push(roleDashboardPaths[role]);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Register to start your internship journey">
      <form onSubmit={handleRegister} className="space-y-4">
        <Select
          label="Register as"
          selectedKeys={[role]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as UserRole;
            if (selected) setRole(selected);
          }}
          variant="bordered"
          radius="lg"
          classNames={formFieldClassNames}
        >
          <SelectItem key="student">Student</SelectItem>
          <SelectItem key="supervisor">Supervisor</SelectItem>
          <SelectItem key="admin">Administrator</SelectItem>
        </Select>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input name="firstName" label="First Name" placeholder="John" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
          <Input name="lastName" label="Last Name" placeholder="Doe" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
        </div>

        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="you@university.edu"
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
        />

        {role === "student" && (
          <>
            <Input name="studentId" label="Student ID" placeholder="STU2024001" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
            <Input name="department" label="Department" placeholder="Computer Science" variant="bordered" radius="lg" classNames={formFieldClassNames} />
            <Input name="program" label="Program" placeholder="BSc Computer Science" variant="bordered" radius="lg" classNames={formFieldClassNames} />
            <div className="grid grid-cols-2 gap-4">
              <Input name="year" label="Year" placeholder="2" variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input name="batch" label="Batch" placeholder="2022" variant="bordered" radius="lg" classNames={formFieldClassNames} />
            </div>
          </>
        )}

        {role === "supervisor" && (
          <>
            <Input name="title" label="Title" placeholder="Dr. / Mr. / Ms." variant="bordered" radius="lg" classNames={formFieldClassNames} />
            <Input name="department" label="Department" placeholder="Computer Science" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
          </>
        )}

        <Input
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-secondary hover:text-text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
        />

        <Button type="submit" color="primary" size="lg" radius="lg" className="w-full font-semibold" isLoading={loading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link as={NextLink} href="/login" size="sm" color="primary">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
~~~

### `app/student/announcements/page.tsx`

~~~tsx
"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { currentStudent } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { Select, SelectItem } from "@heroui/react";
import { useMemo, useState } from "react";

export default function StudentAnnouncementsPage() {
  const { getPublishedAnnouncementsForStudent } = useAppStore();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const announcements = getPublishedAnnouncementsForStudent(currentStudent.id);

  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchesPriority = priorityFilter === "all" || a.priority === priorityFilter;
      const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
      return matchesPriority && matchesCategory;
    });
  }, [announcements, priorityFilter, categoryFilter]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="ds-page-title">Announcements</h1>
        <p className="ds-page-description">
          All updates from administrators and your supervisor, including workshops and deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label="Priority"
          selectedKeys={[priorityFilter]}
          onSelectionChange={(keys) => setPriorityFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
        >
          <SelectItem key="all">All Priorities</SelectItem>
          <SelectItem key="normal">Normal</SelectItem>
          <SelectItem key="important">Important</SelectItem>
          <SelectItem key="urgent">Urgent</SelectItem>
        </Select>
        <Select
          label="Category"
          selectedKeys={[categoryFilter]}
          onSelectionChange={(keys) => setCategoryFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
        >
          <SelectItem key="all">All Categories</SelectItem>
          <SelectItem key="workshop">Workshop</SelectItem>
          <SelectItem key="general">General</SelectItem>
          <SelectItem key="internship">Internship</SelectItem>
          <SelectItem key="deadline">Deadline</SelectItem>
          <SelectItem key="reminder">Reminder</SelectItem>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No announcements</p>
          <p className="mt-1 text-sm text-text-secondary">Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}
~~~

### `app/student/applications/page.tsx`

~~~tsx
"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard, EmptyState } from "@/components/ui/page-header";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { applications, currentStudent } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";
import {
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 5;
const statusOptions: { key: string; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "reviewing", label: "Reviewing" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "withdrawn", label: "Withdrawn" },
];

export default function StudentApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const myApplications = applications.filter((a) => a.studentId === currentStudent.id);

  const filtered = useMemo(() => {
    return myApplications.filter((app) => {
      const matchesSearch =
        !search ||
        app.internshipTitle.toLowerCase().includes(search.toLowerCase()) ||
        app.companyName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myApplications, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Logbook"
        description="Track the status of your internship applications"
      />

      <ContentCard>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by title or company..."
            className="flex-1"
          />
          <Select
            className="w-full sm:w-48"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              if (selected) {
                setStatusFilter(selected);
                setPage(1);
              }
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
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No applications found"
            description="Try adjusting your search or filters, or browse internships to apply."
          />
        ) : (
          <>
            <Table aria-label="Applications table" removeWrapper>
              <TableHeader>
                <TableColumn>INTERNSHIP</TableColumn>
                <TableColumn>COMPANY</TableColumn>
                <TableColumn>APPLIED</TableColumn>
                <TableColumn>STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                {paginated.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <span className="font-medium">{app.internshipTitle}</span>
                    </TableCell>
                    <TableCell>{app.companyName}</TableCell>
                    <TableCell>{formatDate(app.appliedAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={app.status as ApplicationStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <PaginationBar
              page={page}
              total={totalPages}
              onChange={setPage}
              className="mt-6 flex justify-center"
            />
          </>
        )}
      </ContentCard>
    </div>
  );
}
~~~

### `app/student/companies/page.tsx`

~~~tsx
"use client";

import { CompanyDirectoryView } from "@/components/companies/company-directory-view";

export default function StudentCompaniesPage() {
  return (
    <CompanyDirectoryView
      title="Company Directory"
      description="Browse approved partner companies offering internships"
      readOnly
    />
  );
}
~~~

### `app/student/cv/page.tsx`

~~~tsx
"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard } from "@/components/ui/page-header";
import { currentStudent } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import { Button, Chip } from "@heroui/react";
import { CheckCircle, Download, FileText, Trash2, Upload } from "lucide-react";
import { getInitialCvFileName, setStoredCvFileName } from "@/lib/cv-storage";
import { useEffect, useRef, useState } from "react";

export default function StudentCvPage() {
  const { updateStudentRecord } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    setFileName(
      getInitialCvFileName(currentStudent.cvUrl ? "alex-morgan-cv.pdf" : null)
    );
  }, []);
  const [uploading, setUploading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("2025-04-10");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setFileName(file.name);
      setStoredCvFileName(file.name);
      setLastUpdated(new Date().toISOString().slice(0, 10));
      updateStudentRecord(
        currentStudent.id,
        { cvFileName: file.name, cvUrl: `/uploads/${file.name}` },
        "CV document"
      );
      setUploading(false);
      notifySuccess("CV uploaded successfully. Administrator has been notified.");
    }, 900);
  };

  const handleRemove = () => {
    setFileName(null);
    setStoredCvFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    updateStudentRecord(currentStudent.id, { cvFileName: undefined, cvUrl: undefined }, "CV removal");
    notifySuccess("CV removed. Administrator has been notified.");
  };

  const handleDownload = () => {
    notifySuccess("CV download started.");
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
              PDF, DOC, or DOCX â€” max 5MB. Required for all placement applications.
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
                    Last updated: {formatDate(lastUpdated)}
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
~~~

### `app/student/dashboard/page.tsx`

~~~tsx
"use client";

import { NotificationPanel } from "@/components/notifications/notification-panel";
import { currentStudent, studentPortalDashboard } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { Button, Chip } from "@heroui/react";
import { Calendar, Mail, Megaphone, Phone, User } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { reportProgress, nextReport } = studentPortalDashboard;
  const { getAssignedSupervisorForStudent, getPublishedAnnouncementsForStudent, getStudentById, currentUser } = useAppStore();
  const userId = currentUser?.id ?? currentStudent.id;
  const student = getStudentById(userId) ?? currentStudent;
  const progress = reportProgress;
  const supervisor = getAssignedSupervisorForStudent(userId);
  const latestAnnouncements = getPublishedAnnouncementsForStudent(userId).slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="ds-page-title">Hello, {student.name}</h1>
          <p className="ds-page-description">
            {student.internshipCompany
              ? `Active placement at ${student.internshipCompany}`
              : "Track your internship progress and updates"}
          </p>
        </div>
        <NotificationPanel audience="student" userId={userId} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-border/60 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" />
            <h2 className="text-base font-semibold text-text-primary">Assigned Supervisor</h2>
          </div>
          {supervisor ? (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-text-primary">{supervisor.name}</p>
              <p className="text-sm text-text-secondary">{supervisor.title}</p>
              <div className="space-y-1.5 text-sm text-text-secondary">
                <p className="inline-flex items-center gap-2">
                  <Mail size={14} className="text-primary" />
                  {supervisor.email}
                </p>
                {supervisor.phone && (
                  <p className="inline-flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    {supervisor.phone}
                  </p>
                )}
              </div>
              <Chip color="success" variant="flat" size="sm">
                Allocated
              </Chip>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-secondary">
                No supervisor assigned yet. Administration will allocate a supervisor soon.
              </p>
              <Chip color="warning" variant="flat" size="sm" className="mt-2">
                Unassigned
              </Chip>
            </div>
          )}
        </div>

        <div className="rounded-card border border-border/60 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Megaphone size={20} className="text-primary" />
              <h2 className="text-base font-semibold text-text-primary">Announcements</h2>
            </div>
            <Button as={Link} href="/student/announcements" size="sm" variant="flat" color="primary" radius="lg">
              View all
            </Button>
          </div>
          {latestAnnouncements.length === 0 ? (
            <p className="text-sm text-text-secondary">No announcements at this time.</p>
          ) : (
            <ul className="space-y-3">
              {latestAnnouncements.map((a) => (
                <li key={a.id} className="rounded-button border border-border/60 bg-surface-muted p-3">
                  <p className="font-medium text-text-primary">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{a.message}</p>
                  <p className="mt-1 text-xs text-text-secondary capitalize">
                    {a.priority} Â· {a.category}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px]">
        <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text-primary">Internship Progress</h2>
            <span className="rounded-full bg-[#FFF0E0] px-3 py-1 text-xs font-semibold text-[#C06027]">
              {progress.percent}% Complete
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#EDE4DC]">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            {progress.monthsCompleted} months completed. {progress.monthsRemaining} months remaining.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-card bg-primary p-5 text-white shadow-card">
          <Calendar size={22} className="opacity-90" strokeWidth={1.75} />
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
              Next Report Due
            </p>
            <p className="mt-1 text-4xl font-bold leading-none">{nextReport.date}</p>
            <p className="mt-3 text-sm opacity-90">{nextReport.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
~~~

### `app/student/internships/page.tsx`

~~~tsx
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
                    <span>Â·</span>
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
~~~

### `app/student/layout.tsx`

~~~tsx
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { currentStudent } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { roleLabels, studentNavItems } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getStudentById, currentUser } = useAppStore();

  const userId = currentUser?.id ?? currentStudent.id;
  const student = getStudentById(userId) ?? currentStudent;
  const name = currentUser?.name ?? student.name;
  const email = currentUser?.email ?? student.email;

  const modeBadge = pathname.startsWith("/student/reports") ? "Review Mode" : undefined;

  return (
    <DashboardLayout
      navItems={studentNavItems}
      roleLabel={roleLabels.student}
      userName={name}
      userEmail={email}
      profileHref="/student/profile"
      variant="portal"
      userRoleBadge="Student Intern"
      modeBadge={modeBadge}
      notificationAudience="student"
      notificationUserId={userId}
    >
      {children}
    </DashboardLayout>
  );
}
~~~

### `app/student/profile/page.tsx`

~~~tsx
"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard } from "@/components/ui/page-header";
import { currentStudent } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import type { InternshipPlacementStatus } from "@/types";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import {
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Briefcase, Save, User } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const programs = ["Computer Science", "Information Technology", "Software Engineering"];

export default function StudentProfilePage() {
  const { updateStudentRecord, getStudentById, currentUser } = useAppStore();
  const userId = currentUser?.id ?? currentStudent.id;
  const liveStudent = getStudentById(userId) ?? currentStudent;
  const [form, setForm] = useState({
    name: liveStudent.name,
    email: liveStudent.email,
    phone: liveStudent.phone ?? "",
    studentId: liveStudent.studentId,
    program: liveStudent.program,
    year: String(liveStudent.year),
    gpa: liveStudent.gpa?.toString() ?? "",
    department: liveStudent.department ?? "",
  });
  const [internshipForm, setInternshipForm] = useState({
    internshipStatus: (liveStudent.internshipStatus ?? "pending") as InternshipPlacementStatus,
    internshipCompany: liveStudent.internshipCompany ?? "",
    internshipRole: liveStudent.internshipRole ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [savingInternship, setSavingInternship] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!userId || userId.startsWith("stu-")) {
        // Mock ID, skip fetching from Supabase to prevent UUID errors
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/users/${userId}`);
        const result = await response.json();
          
        if (!response.ok || !result.success) throw new Error(result.message || "Failed to load");
        
        const data = result.data;
        if (data) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            studentId: data.student_id || "",
            program: data.program || "",
            year: String(data.year || ""),
            gpa: data.gpa?.toString() || "",
            department: data.department || data.department_code || "",
          });
          setInternshipForm({
            internshipStatus: (data.internship_status || "pending") as InternshipPlacementStatus,
            internshipCompany: data.internship_company || "",
            internshipRole: data.internship_role || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (userId.startsWith("stu-")) {
        throw new Error("You are using a mock user account. Please login properly to save to the database.");
      }

      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          program: form.program,
          year: Number(form.year) || null,
          gpa: form.gpa ? Number(form.gpa) : null,
          department: form.department,
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);

      updateStudentRecord(
        userId,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          program: form.program,
          year: Number(form.year) || liveStudent.year,
          gpa: form.gpa ? Number(form.gpa) : undefined,
          department: form.department,
        },
        "personal and academic profile information"
      );
      notifySuccess("Profile updated successfully.");
    } catch (err: any) {
      console.error(err);
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInternshipSave = async () => {
    setSavingInternship(true);
    try {
      if (userId.startsWith("stu-")) {
        throw new Error("You are using a mock user account. Please login properly to save to the database.");
      }

      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internship_status: internshipForm.internshipStatus,
          internship_company: internshipForm.internshipCompany,
          internship_role: internshipForm.internshipRole,
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);

      updateStudentRecord(
        userId,
        {
          internshipStatus: internshipForm.internshipStatus as any,
          internshipCompany: internshipForm.internshipCompany || undefined,
          internshipRole: internshipForm.internshipRole || undefined,
        },
        "internship details"
      );
      notifySuccess("Internship details updated.");
    } catch (err: any) {
      console.error(err);
      alert("Failed to update internship details: " + err.message);
    } finally {
      setSavingInternship(false);
    }
  };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="My Profile"
        description="Update your personal and academic information"
      />

      <ContentCard>
        <div className="mb-6 flex items-center gap-4">
          <Avatar
            name={getInitials(form.name)}
            size="lg"
            className="h-16 w-16 text-lg"
            color="primary"
          />
          <div>
            <p className="text-lg font-semibold text-text-primary">{form.name}</p>
            <p className="text-sm text-text-secondary">{form.studentId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              value={form.name}
              onValueChange={(v) => update("name", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              startContent={<User className="text-text-secondary" size={18} />}
              isRequired
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onValueChange={(v) => update("email", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isRequired
            />
            <Input
              label="Phone"
              value={form.phone}
              onValueChange={(v) => update("phone", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="Student ID"
              value={form.studentId}
              isReadOnly
              variant="bordered"
              radius="lg"
              classNames={{ ...formFieldClassNames, input: "text-text-secondary" }}
            />
            <Select
              label="Program"
              selectedKeys={[form.program]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) update("program", selected);
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              {programs.map((p) => (
                <SelectItem key={p}>{p}</SelectItem>
              ))}
            </Select>
            <Select
              label="Year"
              selectedKeys={[form.year]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) update("year", selected);
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              {[1, 2, 3, 4].map((y) => (
                <SelectItem key={String(y)}>Year {y}</SelectItem>
              ))}
            </Select>
            <Input
              label="GPA"
              value={form.gpa}
              onValueChange={(v) => update("gpa", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              placeholder="e.g. 3.75"
            />
            <Input
              label="Department"
              value={form.department}
              onValueChange={(v) => update("department", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              color="primary"
              radius="lg"
              startContent={<Save size={18} />}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </ContentCard>
      <ContentCard>
        <div className="mb-5 flex items-center gap-2">
          <Briefcase size={20} className="text-primary" />
          <h2 className="text-base font-semibold text-text-primary">Internship Details</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Select
              label="Internship Status"
              selectedKeys={[internshipForm.internshipStatus]}
              onSelectionChange={(keys) => {
                const v = Array.from(keys)[0] as string;
                if (v) setInternshipForm((f) => ({ ...f, internshipStatus: v as InternshipPlacementStatus }));
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="completed">Completed</SelectItem>
              <SelectItem key="deferred">Deferred</SelectItem>
            </Select>
            <Input
              label="Company Name"
              value={internshipForm.internshipCompany}
              onValueChange={(v) => setInternshipForm((f) => ({ ...f, internshipCompany: v }))}
              placeholder="e.g. TechNova Solutions"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="Role / Position"
              value={internshipForm.internshipRole}
              onValueChange={(v) => setInternshipForm((f) => ({ ...f, internshipRole: v }))}
              placeholder="e.g. Software Engineering Intern"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              className="md:col-span-2"
            />
          </div>
          <div className="flex justify-end">
            <Button
              color="primary"
              radius="lg"
              startContent={<Save size={18} />}
              isLoading={savingInternship}
              onPress={handleInternshipSave}
            >
              Save Internship Details
            </Button>
          </div>
        </div>
      </ContentCard>
    </div>
  );
}
~~~

### `app/student/reports/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PdfViewer } from "@/components/reports/pdf-viewer";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { currentStudent, studentReportProgress } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { apiUploadFile, apiCreateLogbookReport, apiDeleteLogbookReport } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import type { LogbookReport } from "@/types";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FileText, Plus, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const statusFilterOptions: { key: string; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "unreviewed", label: "Unreviewed" },
  { key: "reviewed", label: "Reviewed" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function StudentReportsPage() {
  const { getReportsForStudent, submitLogbookReport, deleteLogbookReport, currentUser } = useAppStore();
  const userId = currentUser?.id ?? currentStudent.id;
  const reports = getReportsForStudent(userId);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newReport, setNewReport] = useState({ period: "", excerpt: "" });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const monthOptions = useMemo(() => {
    const keys = Array.from(new Set(reports.map((r) => r.monthKey))).sort().reverse();
    return [
      { key: "all", label: "All Months" },
      ...keys.map((k) => {
        const report = reports.find((r) => r.monthKey === k);
        return { key: k, label: report?.period ?? k };
      }),
    ];
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesMonth = monthFilter === "all" || r.monthKey === monthFilter;
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesMonth && matchesStatus;
    });
  }, [reports, monthFilter, statusFilter]);

  const detailReport = reports.find((r) => r.id === selectedId) ?? null;
  const { completed, total } = studentReportProgress;

  const handleSubmitReport = async () => {
    if (!newReport.period.trim() || !newReport.excerpt.trim()) {
      notifyError("Please fill in the report period and summary.");
      return;
    }
    if (!pdfFile) {
      notifyError("Please upload your report as a PDF file.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Upload PDF to Supabase storage
      const { url: pdfUrl } = await apiUploadFile(pdfFile);

      // 2. Save report record to DB
      const result = await apiCreateLogbookReport({
        student_id: userId,
        student_name: currentUser?.name ?? currentStudent.name,
        supervisor_id: currentStudent.supervisorId ?? null,
        period: newReport.period.trim(),
        excerpt: newReport.excerpt.trim(),
        pdf_url: pdfUrl,
        pdf_file_name: pdfFile.name,
        status: "pending",
        submitted_at: new Date().toISOString(),
        is_current: true,
      });

      const dbId = (result.data as Record<string, unknown>)?.id as string | undefined;

      // 3. Update in-memory store with real ID and URL
      submitLogbookReport({
        id: dbId,
        studentId: userId,
        period: newReport.period,
        excerpt: newReport.excerpt,
        pdfUrl,
        pdfFileName: pdfFile.name,
      });

      setShowAdd(false);
      setNewReport({ period: "", excerpt: "" });
      setPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      notifySuccess("Monthly report and PDF submitted successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      notifyError("Failed to submit report: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="ds-page-title">Reports</h1>
            <p className="ds-page-description">
              Submit fortnightly reports as PDF and track supervisor reviews.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-card border border-border/60 bg-surface-muted px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Progress
              </p>
              <p className="mt-1 text-xl font-bold text-primary">
                {completed} / {total} Months
              </p>
            </div>
            <Button
              color="primary"
              radius="lg"
              className="font-semibold"
              startContent={<Plus size={18} />}
              onPress={() => setShowAdd(true)}
            >
              Add Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-card border border-border/60 bg-white p-4 shadow-card sm:grid-cols-2">
        <Select
          label="Filter by Month"
          selectedKeys={[monthFilter]}
          onSelectionChange={(keys) => setMonthFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
          aria-label="Month filter"
        >
          {monthOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Select
          label="Filter by Status"
          selectedKeys={[statusFilter]}
          onSelectionChange={(keys) => setStatusFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
          aria-label="Status filter"
        >
          {statusFilterOptions.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No reports match your filters</p>
          <p className="mt-1 text-sm text-text-secondary">
            Submit a new report or adjust filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={() => setSelectedId(report.id)}
              onDelete={async () => {
                try { await apiDeleteLogbookReport(report.id); } catch { /* not in DB yet */ }
                deleteLogbookReport(report.id);
              }}
            />
          ))}
        </div>
      )}

      <AppModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Submit Monthly Report"
        size="2xl"
        footer={
          <>
            <Button variant="light" onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button
              color="primary"
              isLoading={submitting}
              isDisabled={!newReport.period.trim() || !newReport.excerpt.trim() || !pdfFile}
              onPress={handleSubmitReport}
            >
              Submit Report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Report Period"
            placeholder="e.g. Nov 2024"
            value={newReport.period}
            onValueChange={(v) => setNewReport((f) => ({ ...f, period: v }))}
            variant="bordered"
            radius="lg"
          />
          <Textarea
            label="Report Summary"
            placeholder="Brief summary of your monthly activities..."
            value={newReport.excerpt}
            onValueChange={(v) => setNewReport((f) => ({ ...f, excerpt: v }))}
            variant="bordered"
            radius="lg"
            minRows={4}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-text-primary">Report PDF (required)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            />
            {pdfFile ? (
              <div className="flex flex-col gap-2 rounded-button border border-border bg-surface-muted p-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <FileText size={16} className="text-primary" />
                  {pdfFile.name}
                </span>
                <Button size="sm" variant="flat" onPress={() => fileInputRef.current?.click()}>
                  Replace PDF
                </Button>
              </div>
            ) : (
              <Button
                variant="bordered"
                radius="lg"
                className="w-full border-dashed"
                startContent={<Upload size={16} />}
                onPress={() => fileInputRef.current?.click()}
              >
                Upload PDF Report
              </Button>
            )}
          </div>
        </div>
      </AppModal>

      <AppModal
        isOpen={!!detailReport}
        onClose={() => setSelectedId(null)}
        title={detailReport ? `Monthly Report #${detailReport.monthNumber}` : "Report Details"}
        size="3xl"
        footer={
          <Button variant="light" onPress={() => setSelectedId(null)}>Close</Button>
        }
      >
        {detailReport && <ReportDetail report={detailReport} />}
      </AppModal>
    </div>
  );
}

function ReportCard({
  report,
  onView,
  onDelete,
}: {
  report: LogbookReport;
  onView: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const hasReview = report.status === "accepted" || report.status === "rejected" || report.status === "reviewed";
  const canDelete = !hasReview;

  return (
    <article className="flex flex-col rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-text-primary">
          Report #{report.monthNumber}
        </h3>
        {report.isCurrent && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Current
          </span>
        )}
        <ReportStatusBadge status={report.status} />
      </div>
      <p className="text-sm font-medium text-text-secondary">{report.period}</p>
      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{report.excerpt}</p>
      {report.pdfFileName && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
          <FileText size={14} />
          {report.pdfFileName}
        </p>
      )}
      {hasReview && report.marks != null && (
        <p className="mt-2 text-sm font-semibold text-text-primary">
          Marks: <span className="text-primary">{report.marks}</span>
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <Button color="primary" variant="flat" radius="lg" className="flex-1" onPress={onView}>
          View Details
        </Button>
        {canDelete && !confirmDelete && (
          <Button
            color="danger"
            variant="flat"
            radius="lg"
            isIconOnly
            onPress={() => setConfirmDelete(true)}
            aria-label="Delete report"
          >
            <Trash2 size={16} />
          </Button>
        )}
        {canDelete && confirmDelete && (
          <>
            <Button size="sm" color="danger" radius="lg" onPress={() => { onDelete(); setConfirmDelete(false); }}>
              Confirm
            </Button>
            <Button size="sm" variant="flat" radius="lg" onPress={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

function ReportDetail({ report }: { report: LogbookReport }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-sm font-medium text-text-primary">
          {report.period}
        </span>
        <ReportStatusBadge status={report.status} />
        <span className="text-sm text-text-secondary">
          Submitted {formatDate(report.submittedAt)}
        </span>
      </div>

      <p className="text-base leading-relaxed text-text-primary">{report.excerpt}</p>

      <div>
        <p className="mb-2 text-sm font-semibold text-text-primary">Submitted PDF</p>
        <PdfViewer url={report.pdfUrl} fileName={report.pdfFileName} />
      </div>

      {(report.status === "accepted" || report.status === "rejected" || report.status === "reviewed") && (
        <div className="grid gap-4 rounded-button border border-border/60 bg-surface-muted p-4 sm:grid-cols-2">
          {report.marks != null && (
            <div>
              <p className="text-xs font-semibold uppercase text-text-secondary">Marks</p>
              <p className="mt-1 text-2xl font-bold text-primary">{report.marks}</p>
            </div>
          )}
          {report.feedback && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-text-secondary">
                Supervisor Comments
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-primary">{report.feedback}</p>
            </div>
          )}
          {report.reviewedAt && (
            <p className="text-xs text-text-secondary sm:col-span-2">
              Reviewed on {formatDate(report.reviewedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
~~~

### `app/supervisor/broadcast/page.tsx`

~~~tsx
"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { BroadcastForm, type BroadcastFormValues } from "@/components/announcements/broadcast-form";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { currentSupervisor } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import { useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SupervisorBroadcastPage() {
  const { publishAnnouncement, getAllAnnouncements } = useAppStore();
  const [submitting, setSubmitting] = useState(false);

  const myAnnouncements = useMemo(
    () =>
      getAllAnnouncements().filter(
        (a) => a.authorId === currentSupervisor.id && a.authorRole === "supervisor"
      ),
    [getAllAnnouncements]
  );

  const handlePublish = async (values: BroadcastFormValues) => {
    setSubmitting(true);
    try {
      const newAnnouncement = {
        title: values.title,
        message: values.message,
        priority: values.priority,
        target: "supervisor_students",
        author_id: currentSupervisor.id,
        author_name: currentSupervisor.name,
        author_role: "supervisor",
        supervisor_id: currentSupervisor.id,
        link_url: values.linkUrl || null,
        attachment_name: values.attachmentName || null,
        scheduled_at: values.scheduledAt
          ? new Date(values.scheduledAt).toISOString()
          : null,
        category: values.category,
      };

      const response = await fetch(`${API_BASE}/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create announcement");
      }

      publishAnnouncement({
        ...values,
        authorId: currentSupervisor.id,
        authorName: currentSupervisor.name,
        authorRole: "supervisor",
        supervisorId: currentSupervisor.id,
        target: "supervisor_students",
        id: result.data.id,
        createdAt: result.data.created_at,
      } as any);

      notifySuccess(
        !values.scheduledAt
          ? "Broadcast sent to your assigned students."
          : "Broadcast scheduled successfully."
      );
    } catch (err: any) {
      console.error(err);
      alert("Failed to publish broadcast: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Broadcast"
        description="Send notices and reminders to students assigned to you"
      />

      <ContentCard title="Create Broadcast">
        <BroadcastForm
          authorRole="supervisor"
          supervisorId={currentSupervisor.id}
          onSubmit={(v) => handlePublish(v)}
          submitting={submitting}
        />
      </ContentCard>

      <ContentCard title="Your Broadcasts">
        <div className="space-y-4">
          {myAnnouncements.length === 0 ? (
            <p className="text-sm text-text-secondary">No broadcasts yet.</p>
          ) : (
            myAnnouncements.map((a) => (
              <div key={a.id}>
                <AnnouncementCard announcement={a} />
                <p className="mt-1 text-xs text-text-secondary">
                  {a.publishedAt
                    ? `Published ${formatDate(a.publishedAt)}`
                    : `Scheduled ${a.scheduledAt ? formatDate(a.scheduledAt) : "â€”"}`}
                </p>
              </div>
            ))
          )}
        </div>
      </ContentCard>
    </div>
  );
}
~~~

### `app/supervisor/companies/page.tsx`

~~~tsx
"use client";

import { CompanyDirectoryView } from "@/components/companies/company-directory-view";

export default function SupervisorCompaniesPage() {
  return (
    <CompanyDirectoryView
      title="Company Directory"
      description="View all partner companies maintained by administration"
      readOnly
    />
  );
}
~~~

### `app/supervisor/dashboard/page.tsx`

~~~tsx
"use client";

import { StatCard } from "@/components/ui/stat-card";
import { currentSupervisor, supervisorDashboardStats } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";

export default function SupervisorDashboardPage() {
  const { currentUser } = useAppStore();
  const name = currentUser?.name ?? currentSupervisor.name;
  const firstName = name.split(" ").slice(-1)[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-text-secondary">Engineering Faculty</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Welcome, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of your assigned students and report activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supervisorDashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
~~~

### `app/supervisor/layout.tsx`

~~~tsx
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { currentSupervisor, supervisorConsoleMeta } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { roleLabels, supervisorNavItems } from "@/lib/navigation";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore();

  const name = currentUser?.name ?? currentSupervisor.name;
  const email = currentUser?.email ?? currentSupervisor.email;
  const userId = currentUser?.id ?? currentSupervisor.id;

  return (
    <DashboardLayout
      navItems={supervisorNavItems}
      roleLabel={roleLabels.supervisor}
      userName={name}
      userEmail={email}
      profileHref="/supervisor/settings"
      variant="portal"
      userRoleBadge="Faculty Supervisor"
      consoleTitle={supervisorConsoleMeta.consoleTitle}
      consoleVersion={supervisorConsoleMeta.consoleVersion}
      notificationAudience="supervisor"
      notificationUserId={userId}
    >
      {children}
    </DashboardLayout>
  );
}
~~~

### `app/supervisor/reports/page.tsx`

~~~tsx
"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { currentSupervisor, progressReports, students } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import { Chip } from "@heroui/react";
import { useMemo, useState } from "react";

export default function SupervisorReportsPage() {
  const [search, setSearch] = useState("");

  const assignedStudentIds = new Set(
    students.filter((s) => s.supervisorId === currentSupervisor.id).map((s) => s.id)
  );

  const myReports = progressReports.filter((r) => assignedStudentIds.has(r.studentId));

  const filtered = useMemo(() => {
    if (!search) return myReports;
    const q = search.toLowerCase();
    return myReports.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
    );
  }, [myReports, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Monthly reports submitted by your students"
      />

      <div className="mb-2">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search reports..."
          className="max-w-md"
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <ContentCard>
            <p className="py-8 text-center text-sm text-text-secondary">No reports found</p>
          </ContentCard>
        ) : (
          filtered.map((report) => (
            <ContentCard key={report.id}>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{report.studentName}</h3>
                      <Chip size="sm" variant="flat">
                        Week {report.week}
                      </Chip>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Submitted {formatDate(report.submittedAt)}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                <p className="text-sm">{report.summary}</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">
                      Achievements
                    </p>
                    <ul className="space-y-1 text-sm">
                      {report.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-success">âœ“</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">
                      Challenges
                    </p>
                    <ul className="space-y-1 text-sm">
                      {report.challenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning">!</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ContentCard>
          ))
        )}
      </div>
    </div>
  );
}
~~~

### `app/supervisor/reviews/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PdfViewer } from "@/components/reports/pdf-viewer";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { currentSupervisor } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { apiUpdateLogbookReport } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { formatDate } from "@/lib/utils";
import type { LogbookReport } from "@/types";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@heroui/react";
import { Check, Eye, X } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "unreviewed", label: "Unreviewed" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function SupervisorReviewsPage() {
  const { getReportsForSupervisor, reviewLogbookReport, currentUser } = useAppStore();
  const supervisorId = currentUser?.id ?? currentSupervisor.id;
  const allReports = getReportsForSupervisor(supervisorId);

  const [search, setSearch] = useState("");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<LogbookReport | null>(null);
  const [reviewMode, setReviewMode] = useState<"view" | "accept" | "reject">("view");
  const [feedback, setFeedback] = useState("");
  const [marks, setMarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return allReports.filter((r) => {
      const matchesSearch =
        !search ||
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.period.toLowerCase().includes(search.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesStudentId =
        !studentIdFilter ||
        r.studentName.toLowerCase().includes(studentIdFilter.toLowerCase());
      const submitted = new Date(r.submittedAt);
      const matchesFrom = !dateFrom || submitted >= new Date(dateFrom);
      const matchesTo = !dateTo || submitted <= new Date(dateTo + "T23:59:59");
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStudentId && matchesFrom && matchesTo && matchesStatus;
    });
  }, [allReports, search, studentIdFilter, dateFrom, dateTo, statusFilter]);

  const openReview = (report: LogbookReport, mode: "view" | "accept" | "reject") => {
    setSelected(report);
    setReviewMode(mode);
    setFeedback(report.feedback ?? "");
    setMarks(report.marks?.toString() ?? "");
  };

  const closeModal = () => {
    setSelected(null);
    setReviewMode("view");
    setFeedback("");
    setMarks("");
  };

  const handleSaveReview = async (status: "accepted" | "rejected") => {
    if (!selected) return;
    const marksNum = Number(marks);
    if (Number.isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      notifyError("Please enter valid marks between 0 and 100.");
      return;
    }
    if (!feedback.trim()) {
      notifyError("Please provide review comments or feedback.");
      return;
    }
    setSubmitting(true);
    try {
      // Save to DB (best-effort â€” mock IDs will 404 but real ones will save)
      await apiUpdateLogbookReport(selected.id, {
        status,
        marks: marksNum,
        feedback: feedback.trim(),
        reviewed_at: new Date().toISOString(),
      }).catch(() => {});

      reviewLogbookReport({
        reportId: selected.id,
        status,
        marks: marksNum,
        feedback: feedback.trim(),
      });
      notifySuccess(`Report ${status === "accepted" ? "accepted" : "rejected"} successfully.`);
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Review student logbook PDF submissions, assign marks, and set acceptance status"
      />

      <ContentCard>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search student or Report Name..."
            className="md:col-span-2"
          />
          <Input
            label="Student ID / Name"
            placeholder="Filter"
            value={studentIdFilter}
            onValueChange={setStudentIdFilter}
            variant="bordered"
            radius="lg"
          />
          <Select
            label="Status"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => setStatusFilter((Array.from(keys)[0] as string) ?? "all")}
            variant="bordered"
            radius="lg"
          >
            {statusOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
          <Input type="date" label="From" value={dateFrom} onValueChange={setDateFrom} variant="bordered" radius="lg" />
          <Input type="date" label="To" value={dateTo} onValueChange={setDateTo} variant="bordered" radius="lg" />
        </div>

        <TableScroll>
          <Table aria-label="Student logbook reports" removeWrapper>
            <TableHeader>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn>PERIOD</TableColumn>
              <TableColumn className="hidden sm:table-cell">PDF</TableColumn>
              <TableColumn>MARKS</TableColumn>
              <TableColumn>SUBMITTED</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No reports match your filters.">
              {filtered.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <p className="font-medium">{report.studentName}</p>
                  </TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {report.pdfFileName ?? "â€”"}
                  </TableCell>
                  <TableCell>
                    {report.marks != null ? (
                      <span className="font-semibold text-primary">{report.marks}</span>
                    ) : (
                      "â€”"
                    )}
                  </TableCell>
                  <TableCell>{formatDate(report.submittedAt)}</TableCell>
                  <TableCell>
                    <ReportStatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        variant="light"
                        startContent={<Eye size={14} />}
                        onPress={() => openReview(report, "view")}
                      >
                        Review
                      </Button>
                      {report.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            startContent={<Check size={14} />}
                            onPress={() => openReview(report, "accept")}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            startContent={<X size={14} />}
                            onPress={() => openReview(report, "reject")}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </ContentCard>

      <AppModal
        isOpen={!!selected}
        onClose={closeModal}
        title={
          reviewMode === "accept"
            ? "Accept Report"
            : reviewMode === "reject"
              ? "Reject Report"
              : `Review â€” ${selected?.studentName ?? ""}`
        }
        size="3xl"
        footer={
          reviewMode === "view" ? (
            <Button variant="light" onPress={closeModal}>Close</Button>
          ) : (
            <>
              <Button variant="light" onPress={closeModal}>Cancel</Button>
              <Button
                color={reviewMode === "accept" ? "success" : "danger"}
                isLoading={submitting}
                onPress={() =>
                  handleSaveReview(reviewMode === "accept" ? "accepted" : "rejected")
                }
              >
                Save &amp; {reviewMode === "accept" ? "Accept" : "Reject"}
              </Button>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-text-primary">{selected.period}</span>
              <ReportStatusBadge status={selected.status} />
            </div>
            <p className="text-sm text-text-secondary">{selected.excerpt}</p>

            <div>
              <p className="mb-2 text-sm font-semibold text-text-primary">Submitted PDF</p>
              <PdfViewer url={selected.pdfUrl} fileName={selected.pdfFileName} />
            </div>

            <Input
              label="Marks (numeric)"
              type="number"
              min={0}
              max={100}
              value={marks}
              onValueChange={setMarks}
              variant="bordered"
              radius="lg"
              isReadOnly={reviewMode === "view" && selected.status !== "pending"}
              description="Enter a score from 0 to 100"
            />
            <Textarea
              label="Review Comments / Feedback"
              value={feedback}
              onValueChange={setFeedback}
              variant="bordered"
              radius="lg"
              minRows={4}
              isReadOnly={reviewMode === "view" && selected.status !== "pending"}
              placeholder="Provide detailed feedback for the student..."
            />

            {reviewMode === "view" && selected.status === "pending" && (
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <Button color="success" startContent={<Check size={16} />} onPress={() => setReviewMode("accept")}>
                  Accept Report
                </Button>
                <Button color="danger" variant="flat" startContent={<X size={16} />} onPress={() => setReviewMode("reject")}>
                  Reject Report
                </Button>
              </div>
            )}
          </div>
        )}
      </AppModal>
    </div>
  );
}
~~~

### `app/supervisor/settings/page.tsx`

~~~tsx
"use client";

import { supervisorSettings } from "@/lib/settings";
import { notifySuccess } from "@/lib/notify";
import type { SystemSetting } from "@/types";
import { Button, Select, SelectItem } from "@heroui/react";
import { Save } from "lucide-react";
import { useState } from "react";

export default function SupervisorSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>(supervisorSettings);
  const [saving, setSaving] = useState(false);

  const durationSetting = settings[0];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      notifySuccess("Settings saved.");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">Engineering Faculty</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Console preferences</p>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
        {durationSetting?.type === "select" && durationSetting.options && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text-primary">{durationSetting.label}</p>
              <p className="text-sm text-text-secondary">{durationSetting.description}</p>
            </div>
            <Select
              className="w-full sm:w-64"
              selectedKeys={[String(durationSetting.value)]}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                if (val) {
                  setSettings((prev) =>
                    prev.map((s) => (s.id === durationSetting.id ? { ...s, value: val } : s))
                  );
                }
              }}
              variant="bordered"
              radius="lg"
            >
              {durationSetting.options.map((opt) => (
                <SelectItem key={opt}>{opt}</SelectItem>
              ))}
            </Select>
          </div>
        )}
        <div className="mt-6 flex justify-end border-t border-border pt-6">
          <Button color="primary" radius="lg" startContent={<Save size={16} />} isLoading={saving} onPress={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
~~~

### `app/supervisor/students/page.tsx`

~~~tsx
"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PdfViewer } from "@/components/reports/pdf-viewer";
import { TableScroll } from "@/components/ui/table-scroll";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { InternshipStatusPill } from "@/components/supervisor/internship-status-pill";
import { currentSupervisor, supervisorConsoleMeta } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { getInitialCvFileName } from "@/lib/cv-storage";
import { getInitials } from "@/lib/utils";
import type { Student } from "@/types";
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Download, Eye, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function SupervisorStudentsPage() {
  const { students, getReportsForStudent, currentUser } = useAppStore();
  const supervisorId = currentUser?.id ?? currentSupervisor.id;
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | undefined>();

  const assignedStudents = useMemo(
    () => students.filter((s) => s.supervisorId === supervisorId),
    [students, supervisorId]
  );

  const filtered = useMemo(() => {
    if (!search) return assignedStudents;
    const q = search.toLowerCase();
    return assignedStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
    );
  }, [assignedStudents, search]);

  useEffect(() => {
    if (!selectedStudent) {
      setCvPreviewUrl(undefined);
      return;
    }
    const cvName =
      selectedStudent.id === "stu-001"
        ? getInitialCvFileName(selectedStudent.cvFileName ?? "alex-morgan-cv.pdf")
        : selectedStudent.cvFileName;
    if (cvName) {
      setCvPreviewUrl("https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf");
    } else {
      setCvPreviewUrl(undefined);
    }
  }, [selectedStudent]);

  const openProfile = (student: Student) => setSelectedStudent(student);
  const closeModal = () => setSelectedStudent(null);

  const studentReports = selectedStudent
    ? getReportsForStudent(selectedStudent.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">
          {supervisorConsoleMeta.facultyName}{" "}
          <span className="mx-1 text-text-secondary/60">&gt;</span> Students
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="ds-page-title">Students</h1>
            <p className="ds-page-description">
              View complete profiles, CVs, and internship details for assigned students.
            </p>
          </div>
          <div className="rounded-card border border-border/60 bg-surface-muted px-4 py-2 text-sm font-semibold text-text-primary">
            {filtered.length} assigned
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-6">
        <div className="relative max-w-xl">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            size={18}
          />
          <input
            type="search"
            placeholder="Search by Student ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-input border border-border bg-white py-2.5 pl-10 pr-4 text-base text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border/60 bg-white shadow-card">
        <TableScroll>
          <Table aria-label="Assigned students" removeWrapper>
            <TableHeader>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn className="hidden sm:table-cell">STUDENT ID</TableColumn>
              <TableColumn>DEPARTMENT</TableColumn>
              <TableColumn className="hidden md:table-cell">BATCH</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No students assigned to you match this search.">
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={getInitials(student.name)}
                        size="sm"
                        getInitials={getInitials}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary">{student.name}</p>
                        <p className="text-xs text-text-secondary sm:hidden">{student.studentId}</p>
                        <p className="text-xs text-text-secondary">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-medium text-text-secondary">
                    {student.studentId}
                  </TableCell>
                  <TableCell>{student.departmentCode ?? student.program}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.batch ?? "â€”"}</TableCell>
                  <TableCell>
                    {student.internshipStatus ? (
                      <InternshipStatusPill status={student.internshipStatus} />
                    ) : (
                      "â€”"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<Eye size={14} />}
                      onPress={() => openProfile(student)}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </div>

      <AppModal
        isOpen={!!selectedStudent}
        onClose={closeModal}
        title={selectedStudent ? `${selectedStudent.name} â€” Profile` : "Student Profile"}
        size="3xl"
        footer={
          <Button variant="light" onPress={closeModal}>Close</Button>
        }
      >
        {selectedStudent && (
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Personal &amp; Academic
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField label="Name" value={selectedStudent.name} />
                <ProfileField label="Student ID" value={selectedStudent.studentId} />
                <ProfileField label="Email" value={selectedStudent.email} />
                <ProfileField label="Phone" value={selectedStudent.phone ?? "â€”"} />
                <ProfileField label="Department" value={selectedStudent.departmentCode ?? "â€”"} />
                <ProfileField label="Program" value={selectedStudent.program} />
                <ProfileField label="Batch" value={selectedStudent.batch ?? "â€”"} />
                <ProfileField label="Year" value={`Year ${selectedStudent.year}`} />
                <ProfileField label="GPA" value={selectedStudent.gpa?.toString() ?? "â€”"} />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Internship Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  label="Company"
                  value={selectedStudent.internshipCompany ?? "â€”"}
                />
                <ProfileField label="Role" value={selectedStudent.internshipRole ?? "â€”"} />
                <div>
                  <p className="text-xs font-semibold uppercase text-text-secondary">Placement Status</p>
                  <div className="mt-2">
                    {selectedStudent.internshipStatus ? (
                      <InternshipStatusPill status={selectedStudent.internshipStatus} />
                    ) : (
                      "â€”"
                    )}
                  </div>
                </div>
                <ProfileField
                  label="Logbook Submissions"
                  value={`${studentReports.length} report(s)`}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Logbook Reports
              </h3>
              {studentReports.length === 0 ? (
                <p className="text-sm text-text-secondary">No reports submitted yet.</p>
              ) : (
                <ul className="max-h-48 space-y-2 overflow-y-auto">
                  {studentReports.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-button border border-border/60 bg-surface-muted p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {r.period} Â· #{r.monthNumber}
                        </p>
                        {r.marks != null && (
                          <p className="text-xs text-text-secondary">Marks: {r.marks}</p>
                        )}
                        {r.feedback && (
                          <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                            {r.feedback}
                          </p>
                        )}
                      </div>
                      <ReportStatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                  Latest CV
                </h3>
                {selectedStudent.cvFileName && (
                  <Button
                    size="sm"
                    variant="bordered"
                    startContent={<Download size={14} />}
                    onPress={() => window.open(cvPreviewUrl, "_blank")}
                  >
                    Download CV
                  </Button>
                )}
              </div>
              {selectedStudent.cvFileName ? (
                <>
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <FileText size={16} />
                    {selectedStudent.cvFileName}
                  </p>
                  <PdfViewer url={cvPreviewUrl} fileName={selectedStudent.cvFileName} />
                </>
              ) : (
                <p className="rounded-button border border-dashed border-border p-6 text-center text-sm text-text-secondary">
                  No CV uploaded yet.
                </p>
              )}
            </section>
          </div>
        )}
      </AppModal>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-base font-medium text-text-primary">{value}</p>
    </div>
  );
}
~~~

### `app/supervisor/supervisors/page.tsx`

~~~tsx
"use client";

import { useAppStore } from "@/lib/store/app-store";
import { getInitials } from "@/lib/utils";
import { Avatar } from "@heroui/react";

export default function SupervisorDirectoryPage() {
  const { supervisors } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">Engineering Faculty</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Supervisors Directory
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Faculty supervisors available for student assignments
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {supervisors.map((supervisor) => (
          <div
            key={supervisor.id}
            className="flex items-center gap-4 rounded-card border border-border/60 bg-white p-5 shadow-card"
          >
            <Avatar name={getInitials(supervisor.name)} size="md" color="secondary" />
            <div>
              <p className="font-semibold text-text-primary">{supervisor.name}</p>
              <p className="text-sm text-text-secondary">{supervisor.title}</p>
              <p className="text-xs text-text-secondary">
                {supervisor.department} Â· {supervisor.assignedStudents} students
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
~~~

### `backend/package.json`

~~~json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@supabase/supabase-js": "^2.107.0",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
~~~

### `backend/README.md`

~~~md
~~~

### `backend/sql/create_all_tables.sql`

~~~sql
-- Create required extension
create extension if not exists pgcrypto;

-- USERS
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  role text not null,
  password_hash text,
  phone text,
  avatar_url text,
  department text,
  created_at timestamptz default now()
);
create unique index if not exists users_email_idx on public.users(email);

-- ANNOUNCEMENTS
create table if not exists public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  author_id uuid references public.users(id),
  author_name text,
  author_role text,
  priority text,
  target text,
  supervisor_id uuid,
  link_url text,
  attachment_name text,
  scheduled_at timestamptz,
  published_at timestamptz,
  category text,
  created_at timestamptz default now()
);

-- COMPANIES
create table if not exists public.companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  industry text,
  location text,
  email text,
  phone text,
  website text,
  status text,
  logo text,
  description text,
  company_letter text,
  created_at timestamptz default now()
);

-- INTERNSHIPS
create table if not exists public.internships (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company_id uuid references public.companies(id),
  company_name text,
  location text,
  type text,
  duration text,
  deadline timestamptz,
  description text,
  requirements text[],
  slots int default 0,
  applied int default 0,
  status text,
  stipend text,
  department_category text,
  created_at timestamptz default now()
);

-- APPLICATIONS
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.users(id),
  student_name text,
  internship_id uuid references public.internships(id),
  internship_title text,
  company_name text,
  status text,
  applied_at timestamptz default now(),
  cover_letter text,
  cv_url text
);

-- LOGBOOK REPORTS
create table if not exists public.logbook_reports (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.users(id),
  student_name text,
  supervisor_id uuid references public.users(id),
  month_number int,
  period text,
  month_key text,
  submitted_at timestamptz default now(),
  status text,
  excerpt text,
  pdf_url text,
  pdf_file_name text,
  feedback text,
  marks int,
  reviewed_at timestamptz,
  is_current boolean default false
);

-- PROGRESS REPORTS
create table if not exists public.progress_reports (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.users(id),
  student_name text,
  week int,
  submitted_at timestamptz default now(),
  status text,
  summary text,
  achievements text[],
  challenges text[]
);

-- REVIEWS
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.users(id),
  student_name text,
  supervisor_id uuid references public.users(id),
  title text,
  type text,
  submitted_at timestamptz default now(),
  status text,
  content text,
  feedback text,
  score int
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  audience text,
  user_id uuid references public.users(id),
  title text,
  message text,
  read boolean default false,
  created_at timestamptz default now(),
  type text,
  category text
);

-- SYSTEM SETTINGS
create table if not exists public.system_settings (
  id uuid default gen_random_uuid() primary key,
  label text,
  description text,
  value text,
  type text,
  options text[]
);

-- Grants for service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
~~~

### `backend/src/announcements/announcements.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listAnnouncements = async (req, res) => {
  try {
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("announcements").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("announcements").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("announcements").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/announcements/announcements.routes.js`

~~~js
import express from "express";
import {
  listAnnouncements,
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "./announcements.controller.js";

const router = express.Router();

router.get("/", listAnnouncements);
router.post("/", createAnnouncement);
router.get("/:id", getAnnouncement);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
~~~

### `backend/src/applications/applications.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listApplications = async (req, res) => {
  try {
    const { data, error } = await supabase.from("applications").select("*").order("applied_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createApplication = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("applications").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("applications").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/applications/applications.routes.js`

~~~js
import express from "express";
import { listApplications, createApplication, getApplication, updateApplication, deleteApplication } from "./applications.controller.js";

const router = express.Router();

router.get("/", listApplications);
router.post("/", createApplication);
router.get("/:id", getApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
~~~

### `backend/src/auth/auth.controller.js`

~~~js
import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// REGISTER
export const register = async (req, res) => {

  try {

    const { name, email, password, role, student_id, department, program, year, batch, title } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertData = {
      name,
      email,
      password_hash: hashedPassword,
      role,
      student_id: role === "student" ? student_id : null,
      department: department || null,
      program: role === "student" ? program || null : null,
      year: role === "student" ? year || null : null,
      batch: role === "student" ? batch || null : null,
      title: role === "supervisor" ? title || null : null,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([insertData]);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }

};


// LOGIN
export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (!data.password_hash) {
      return res.status(400).json({ success: false, message: "User password is not set" });
    }

    const validPassword = await bcrypt.compare(password, data.password_hash);

    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: data.id, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: data.id,
        user_id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }
    });

  } catch (err) {

    res.status(500).json({ success: false, message: err.message });

  }

};
~~~

### `backend/src/auth/auth.middleware.js`

~~~js
import jwt from "jsonwebtoken";


// VERIFY TOKEN
export const verifyToken = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};


// ROLE MIDDLEWARE
export const checkRole = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();

  };

};
~~~

### `backend/src/auth/auth.routes.js`

~~~js
import express from "express";
import { register, login } from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;
~~~

### `backend/src/companies/companies.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listCompanies = async (req, res) => {
  try {
    const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCompany = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("companies").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("companies").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/companies/companies.routes.js`

~~~js
import express from "express";
import { listCompanies, createCompany, getCompany, updateCompany, deleteCompany } from "./companies.controller.js";

const router = express.Router();

router.get("/", listCompanies);
router.post("/", createCompany);
router.get("/:id", getCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
~~~

### `backend/src/config/supabase.js`

~~~js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_KEY;

if (!url) {
  console.error("Missing SUPABASE_URL in environment variables");
}

if (!serviceKey && !anonKey) {
  console.error("Missing SUPABASE_KEY or SUPABASE_SERVICE_KEY / SUPABASE_SERVICE_ROLE_KEY in environment variables");
}

if (anonKey && anonKey.startsWith("sb_publishable")) {
  console.warn(
    "Warning: SUPABASE_KEY looks like a publishable (anon) key. For server-side inserts with RLS enabled use SUPABASE_SERVICE_KEY (service_role)."
  );
}

export const supabase = createClient(url, serviceKey || anonKey, {
  auth: { persistSession: false },
});
~~~

### `backend/src/internships/internships.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listInternships = async (req, res) => {
  try {
    const { data, error } = await supabase.from("internships").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createInternship = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("internships").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("internships").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("internships").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("internships").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/internships/internships.routes.js`

~~~js
import express from "express";
import { listInternships, createInternship, getInternship, updateInternship, deleteInternship } from "./internships.controller.js";

const router = express.Router();

router.get("/", listInternships);
router.post("/", createInternship);
router.get("/:id", getInternship);
router.put("/:id", updateInternship);
router.delete("/:id", deleteInternship);

export default router;
~~~

### `backend/src/logbook_reports/logbook_reports.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listLogbookReports = async (req, res) => {
  try {
    const { data, error } = await supabase.from("logbook_reports").select("*").order("submitted_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLogbookReport = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("logbook_reports").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLogbookReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("logbook_reports").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLogbookReport = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("logbook_reports").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLogbookReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("logbook_reports").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/logbook_reports/logbook_reports.routes.js`

~~~js
import express from "express";
import { listLogbookReports, createLogbookReport, getLogbookReport, updateLogbookReport, deleteLogbookReport } from "./logbook_reports.controller.js";

const router = express.Router();

router.get("/", listLogbookReports);
router.post("/", createLogbookReport);
router.get("/:id", getLogbookReport);
router.put("/:id", updateLogbookReport);
router.delete("/:id", deleteLogbookReport);

export default router;
~~~

### `backend/src/notifications/notifications.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("notifications").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("notifications").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("notifications").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/notifications/notifications.routes.js`

~~~js
import express from "express";
import { listNotifications, createNotification, getNotification, updateNotification, deleteNotification } from "./notifications.controller.js";

const router = express.Router();

router.get("/", listNotifications);
router.post("/", createNotification);
router.get("/:id", getNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
~~~

### `backend/src/progress_reports/progress_reports.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listProgressReports = async (req, res) => {
  try {
    const { data, error } = await supabase.from("progress_reports").select("*").order("submitted_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProgressReport = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("progress_reports").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProgressReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("progress_reports").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProgressReport = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("progress_reports").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProgressReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("progress_reports").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/progress_reports/progress_reports.routes.js`

~~~js
import express from "express";
import { listProgressReports, createProgressReport, getProgressReport, updateProgressReport, deleteProgressReport } from "./progress_reports.controller.js";

const router = express.Router();

router.get("/", listProgressReports);
router.post("/", createProgressReport);
router.get("/:id", getProgressReport);
router.put("/:id", updateProgressReport);
router.delete("/:id", deleteProgressReport);

export default router;
~~~

### `backend/src/reviews/reviews.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listReviews = async (req, res) => {
  try {
    const { data, error } = await supabase.from("reviews").select("*").order("submitted_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("reviews").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("reviews").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("reviews").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/reviews/reviews.routes.js`

~~~js
import express from "express";
import { listReviews, createReview, getReview, updateReview, deleteReview } from "./reviews.controller.js";

const router = express.Router();

router.get("/", listReviews);
router.post("/", createReview);
router.get("/:id", getReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
~~~

### `backend/src/server.js`

~~~js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth/auth.routes.js";
import { verifyToken, checkRole } from "./auth/auth.middleware.js";
import studentsRoutes from "./students/students.routes.js";
import announcementsRoutes from "./announcements/announcements.routes.js";
import companiesRoutes from "./companies/companies.routes.js";
import internshipsRoutes from "./internships/internships.routes.js";
import applicationsRoutes from "./applications/applications.routes.js";
import logbookReportsRoutes from "./logbook_reports/logbook_reports.routes.js";
import progressReportsRoutes from "./progress_reports/progress_reports.routes.js";
import reviewsRoutes from "./reviews/reviews.routes.js";
import notificationsRoutes from "./notifications/notifications.routes.js";
import systemSettingsRoutes from "./system_settings/system_settings.routes.js";
import usersRoutes from "./users/users.routes.js";
import uploadsRoutes from "./uploads/uploads.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/students", studentsRoutes);
app.use("/announcements", announcementsRoutes);
app.use("/companies", companiesRoutes);
app.use("/internships", internshipsRoutes);
app.use("/applications", applicationsRoutes);
app.use("/logbook_reports", logbookReportsRoutes);
app.use("/progress_reports", progressReportsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/system_settings", systemSettingsRoutes);
app.use("/users", usersRoutes);
app.use("/uploads", uploadsRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.get("/student/dashboard", verifyToken, checkRole("student"), (req, res) => {
  res.json({ success: true, message: "Welcome Student", user: req.user });
});

app.get("/admin/dashboard", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ success: true, message: "Welcome Admin", user: req.user });
});

app.get("/supervisor/dashboard", verifyToken, checkRole("supervisor"), (req, res) => {
  res.json({ success: true, message: "Welcome Supervisor", user: req.user });
});

// Debug: list registered routes
app.get("/__routes", (req, res) => {
  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        routes.push({ path: middleware.route.path, methods: middleware.route.methods });
      } else if (middleware.name === "router" && middleware.handle && middleware.handle.stack) {
        // router middleware
        middleware.handle.stack.forEach(function (handler) {
          const route = handler.route;
          route && routes.push({ path: route.path, methods: route.methods });
        });
      }
    });
    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
~~~

### `backend/src/students/students.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listStudents = async (req, res) => {
  try {
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase.from("students").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: "Not found", error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const payload = req.body;
    // minimal validation
    if (!payload.name || !payload.studentId || !payload.email) {
      return res.status(400).json({ success: false, message: "name, studentId and email are required" });
    }

    const insertRow = {
      name: payload.name,
      student_id: payload.studentId,
      email: payload.email,
      department: payload.department ?? null,
      department_code: payload.departmentCode ?? null,
      batch: payload.batch ?? null,
      program: payload.program ?? null,
      phone: payload.phone ?? null,
      supervisor_id: payload.supervisorId ?? null,
    };

    const { data, error } = await supabase.from("students").insert([insertRow]).select().single();

    if (error) return res.status(500).json({ success: false, message: error.message, error });

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const { data, error } = await supabase.from("students").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/students/students.routes.js`

~~~js
import express from "express";
import { createStudent, listStudents, getStudent } from "./students.controller.js";
import { verifyToken, checkRole } from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", listStudents);
router.get("/:id", getStudent);
// protect creation to admin and supervisor
// For initial testing allow unauthenticated POST; add auth middleware later
router.post("/", createStudent);

export default router;
~~~

### `backend/src/system_settings/system_settings.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listSystemSettings = async (req, res) => {
  try {
    const { data, error } = await supabase.from("system_settings").select("*");
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const upsertSystemSetting = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("system_settings").upsert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/system_settings/system_settings.routes.js`

~~~js
import express from "express";
import { listSystemSettings, upsertSystemSetting } from "./system_settings.controller.js";

const router = express.Router();

router.get("/", listSystemSettings);
router.post("/", upsertSystemSetting);

export default router;
~~~

### `backend/src/test-insert-student-direct.js`

~~~js
import { supabase } from "./config/supabase.js";

async function run() {
  try {
    const row = {
      name: "Direct Insert Student",
      student_id: `ENG-DIRECT-${Date.now()}`,
      email: `direct.insert.${Date.now()}@example.com`,
      department: "Engineering",
      department_code: "ENG",
      batch: "2026",
      program: "Software Engineering",
      phone: "+1 555 000 000",
      supervisor_id: null,
    };

    const { data, error } = await supabase.from("students").insert([row]).select().single();

    if (error) {
      console.error("Insert error:", error);
      process.exit(1);
    }

    console.log("Insert succeeded:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

run();
~~~

### `backend/src/test-supabase.js`

~~~js
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

test().catch(console.error);
~~~

### `backend/src/test-supabase-connection.js`

~~~js
import { supabase } from "./config/supabase.js";

async function test() {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      console.error("Supabase error:", error);
      process.exit(1);
    }

    console.log("Supabase query succeeded. Sample data:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

test();
~~~

### `backend/src/test-supabase-insert.js`

~~~js
import { supabase } from "./config/supabase.js";

async function testInsert() {
  try {
    const newUser = {
      name: "Test Insert",
      email: `test_insert_${Date.now()}@example.com`,
      password_hash: "dummyhash",
      role: "student",
    };

    const { data, error } = await supabase.from("users").insert([newUser]).select();

    if (error) {
      console.error("Supabase insert error:", error);
      process.exit(1);
    }

    console.log("Insert succeeded, returned:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

testInsert();
~~~

### `backend/src/test-supabase-select.js`

~~~js
import { supabase } from "./config/supabase.js";

async function testSelect() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Supabase select error:", error);
      process.exit(1);
    }

    console.log("Select succeeded, row:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

testSelect();
~~~

### `backend/src/uploads/uploads.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    const filePath = `${Date.now()}_${req.file.originalname}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

    if (error) return res.status(500).json({ success: false, message: error.message, error });

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;

    res.status(201).json({ success: true, url: publicUrl, path: data.path });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/uploads/uploads.routes.js`

~~~js
import express from "express";
import multer from "multer";
import { uploadFile } from "./uploads.controller.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), uploadFile);

export default router;
~~~

### `backend/src/users/users.controller.js`

~~~js
import { supabase } from "../config/supabase.js";

export const listUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("users").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("users").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
~~~

### `backend/src/users/users.routes.js`

~~~js
import express from "express";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "./users.controller.js";

const router = express.Router();

router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);

export default router;
~~~

### `components/announcements/announcement-card.tsx`

~~~tsx
"use client";

import { AnnouncementPriorityBadge } from "@/components/announcements/announcement-priority-badge";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/types";
import { ExternalLink, Paperclip, User } from "lucide-react";

export function AnnouncementCard({ announcement: a }: { announcement: Announcement }) {
  return (
    <article className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-text-primary sm:text-lg">{a.title}</h3>
        <AnnouncementPriorityBadge priority={a.priority} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary sm:text-sm">
        <span className="inline-flex items-center gap-1">
          <User size={14} />
          {a.authorName} ({a.authorRole})
        </span>
        <span>{formatDate(a.publishedAt ?? a.createdAt)}</span>
        <span className="capitalize">{a.category}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-primary sm:text-base">{a.message}</p>
      {(a.linkUrl || a.attachmentName) && (
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {a.attachmentName && (
            <span className="inline-flex items-center gap-1 text-text-secondary">
              <Paperclip size={14} />
              {a.attachmentName}
            </span>
          )}
          {a.linkUrl && (
            <a
              href={a.linkUrl}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              target={a.linkUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              <ExternalLink size={14} />
              View link
            </a>
          )}
        </div>
      )}
    </article>
  );
}
~~~

### `components/announcements/announcement-priority-badge.tsx`

~~~tsx
"use client";

import { cn } from "@/lib/utils";
import type { AnnouncementPriority } from "@/types";

const styles: Record<AnnouncementPriority, string> = {
  normal: "bg-surface-muted text-text-secondary",
  important: "bg-[#FFF3E0] text-[#E65100]",
  urgent: "bg-[#FFEBEE] text-[#C62828]",
};

export function AnnouncementPriorityBadge({ priority }: { priority: AnnouncementPriority }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        styles[priority]
      )}
    >
      {priority}
    </span>
  );
}
~~~

### `components/announcements/broadcast-form.tsx`

~~~tsx
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
~~~

### `components/auth/auth-layout.tsx`

~~~tsx
"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-500 via-brand-600 to-brand-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-button bg-white/20 backdrop-blur">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-lg font-bold">IITS</p>
            <p className="text-sm text-white/70">Wayamba University of Sri Lanka</p>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Streamline your
            <br />
            internship journey
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Connect students, supervisors, and companies in one unified platform for
            industrial training management.
          </p>
        </div>

        <p className="text-sm text-white/50">Â© 2026 Intern & Industrial Training System</p>
      </div>

      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary text-white shadow-card">
                <GraduationCap size={20} />
              </div>
              <span className="text-lg font-bold text-text-primary">IITS</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
            <p className="mt-2 text-text-secondary">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
~~~

### `components/companies/company-directory-view.tsx`

~~~tsx
"use client";

import { useAppStore } from "@/lib/store/app-store";
import { SearchBar } from "@/components/ui/search-bar";
import { Building2, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useMemo, useState } from "react";

interface CompanyDirectoryViewProps {
  title?: string;
  description?: string;
  readOnly?: boolean;
}

export function CompanyDirectoryView({
  title = "Company Directory",
  description = "Browse partner companies and internship opportunities",
  readOnly = true,
}: CompanyDirectoryViewProps) {
  const { getApprovedCompanies } = useAppStore();
  const [search, setSearch] = useState("");
  const companies = getApprovedCompanies();

  const filtered = useMemo(() => {
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.companyLetter?.toLowerCase().includes(q) ?? false)
    );
  }, [companies, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ds-page-title">{title}</h1>
        <p className="ds-page-description">{description}</p>
        {readOnly && (
          <p className="mt-2 text-sm text-text-secondary">
            Directory is managed by administrators. Updates appear here automatically.
          </p>
        )}
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search companies..."
        className="max-w-xl"
      />

      {filtered.length === 0 ? (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No companies found</p>
          <p className="mt-1 text-sm text-text-secondary">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => (
            <article
              key={company.id}
              className="flex flex-col rounded-card border border-border/60 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover sm:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-primary/10 text-primary">
                  <Building2 size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-text-primary">{company.name}</h2>
                  <p className="text-sm text-text-secondary">{company.industry}</p>
                  {company.companyLetter && (
                    <p className="mt-1 font-mono text-xs font-medium text-primary">
                      {company.companyLetter}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">
                {company.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0 text-primary" />
                  {company.location}
                </li>
                <li className="flex items-center gap-2 break-all">
                  <Mail size={14} className="shrink-0 text-primary" />
                  {company.email}
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="shrink-0 text-primary" />
                  {company.phone}
                </li>
                {company.website && (
                  <li className="flex items-center gap-2 break-all">
                    <Globe size={14} className="shrink-0 text-primary" />
                    {company.website.replace(/^https?:\/\//, "")}
                  </li>
                )}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
~~~

### `components/layout/app-header.tsx`

~~~tsx
"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { cn, getInitials } from "@/lib/utils";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import type { NotificationAudience } from "@/types";
import { ChevronDown, GraduationCap, LogOut, Menu, PanelLeft, PanelLeftClose, User, X } from "lucide-react";
import Link from "next/link";

interface AppHeaderProps {
  userName: string;
  userEmail: string;
  userRoleBadge: string;
  profileHref: string;
  onSidebarToggle: () => void;
  showSidebarToggle?: boolean;
  sidebarCollapsed?: boolean;
  mobileMenuOpen?: boolean;
  modeBadge?: string;
  notificationAudience?: NotificationAudience;
  notificationUserId?: string;
}

export function AppHeader({
  userName,
  userEmail,
  userRoleBadge,
  profileHref,
  onSidebarToggle,
  showSidebarToggle = true,
  sidebarCollapsed = false,
  mobileMenuOpen = false,
  modeBadge,
  notificationAudience,
  notificationUserId,
}: AppHeaderProps) {
  const ToggleIcon = mobileMenuOpen ? X : Menu;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {showSidebarToggle && (
            <Button
              isIconOnly
              variant="light"
              radius="lg"
              aria-label={mobileMenuOpen ? "Close menu" : sidebarCollapsed ? "Expand sidebar" : "Toggle sidebar"}
              onPress={onSidebarToggle}
              className="shrink-0 text-text-secondary"
            >
              <span className="lg:hidden">
                <ToggleIcon size={22} />
              </span>
              <span className="hidden lg:inline-flex">
                {sidebarCollapsed ? <PanelLeft size={22} /> : <PanelLeftClose size={22} />}
              </span>
            </Button>
          )}
          <div className="flex min-w-0 items-center gap-2.5">
            <GraduationCap size={22} className="shrink-0 text-primary" strokeWidth={1.75} />
            <span className="truncate font-sans text-base font-semibold text-text-primary sm:text-lg">
              Intern &amp; Training Portal
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {modeBadge && (
            <span className="hidden rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary sm:inline">
              {modeBadge}
            </span>
          )}

          {notificationAudience && (
            <NotificationPanel audience={notificationAudience} userId={notificationUserId} />
          )}

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="light"
                radius="lg"
                className={cn(
                  "h-auto min-h-10 gap-2 px-2 py-1.5 font-sans",
                  "data-[hover=true]:bg-surface-muted"
                )}
              >
                <Avatar
                  name={getInitials(userName)}
                  size="sm"
                  classNames={{
                    base: "h-9 w-9 bg-primary/10 text-primary ring-2 ring-border sm:h-10 sm:w-10",
                  }}
                  getInitials={getInitials}
                />
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-tight text-text-primary">{userName}</p>
                  <p className="text-xs font-medium text-text-secondary">{userRoleBadge}</p>
                </div>
                <ChevronDown size={16} className="hidden text-text-secondary sm:block" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile menu"
              className="min-w-[220px] rounded-card border border-border bg-surface-card font-sans text-base shadow-card"
            >
              <DropdownItem
                key="profile"
                href={profileHref}
                as={Link}
                startContent={<User size={18} />}
                description={userEmail}
                classNames={{ title: "text-base font-medium" }}
              >
                View Profile
              </DropdownItem>
              <DropdownItem
                key="logout"
                href="/login"
                as={Link}
                color="danger"
                startContent={<LogOut size={18} />}
                className="text-danger"
                classNames={{ title: "text-base font-medium" }}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
~~~

### `components/layout/dashboard-layout.tsx`

~~~tsx
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import type { NavItem, NotificationAudience } from "@/types";
import { useCallback, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  userEmail: string;
  profileHref: string;
  variant?: "default" | "portal";
  userRoleBadge?: string;
  consoleTitle?: string;
  consoleVersion?: string;
  modeBadge?: string;
  notificationAudience?: NotificationAudience;
  notificationUserId?: string;
}

export function DashboardLayout({
  children,
  navItems,
  roleLabel,
  userName,
  userEmail,
  profileHref,
  variant = "default",
  userRoleBadge,
  consoleTitle,
  consoleVersion,
  modeBadge,
  notificationAudience,
  notificationUserId,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPortal = variant === "portal";
  const showSidebar = navItems.length > 0;
  const sidebarWidth = showSidebar
    ? collapsed
      ? "lg:ml-[72px]"
      : "lg:ml-[260px]"
    : "";

  const handleSidebarToggle = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setMobileOpen((open) => !open);
    } else {
      setCollapsed((c) => !c);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface font-sans">
      {showSidebar && (
        <Sidebar
          items={navItems}
          collapsed={collapsed}
          onToggle={handleSidebarToggle}
          roleLabel={roleLabel}
          userName={userName}
          userRoleBadge={userRoleBadge}
          variant={variant}
          consoleTitle={consoleTitle}
          consoleVersion={consoleVersion}
          sidebarCollapsed={collapsed}
        />
      )}

      {mobileOpen && showSidebar && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          items={navItems}
          roleLabel={roleLabel}
          userName={userName}
          userRoleBadge={userRoleBadge}
          variant={variant}
          consoleTitle={consoleTitle}
          consoleVersion={consoleVersion}
          mobile
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div className={cn("flex min-h-screen flex-col transition-all duration-300", sidebarWidth)}>
        {isPortal ? (
          <AppHeader
            userName={userName}
            userEmail={userEmail}
            userRoleBadge={userRoleBadge ?? roleLabel}
            profileHref={profileHref}
            modeBadge={modeBadge}
            showSidebarToggle={showSidebar}
            sidebarCollapsed={collapsed}
            mobileMenuOpen={mobileOpen}
            onSidebarToggle={handleSidebarToggle}
            notificationAudience={notificationAudience}
            notificationUserId={notificationUserId}
          />
        ) : (
          <Navbar
            userName={userName}
            userEmail={userEmail}
            showMenuButton={showSidebar}
            onMenuClick={handleSidebarToggle}
          />
        )}

        <main className={cn("flex-1", isPortal ? "p-4 sm:p-6 lg:p-8 xl:p-10" : "p-4 md:p-6 lg:p-8")}>
          <div className="animate-slide-up mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
~~~

### `components/layout/navbar.tsx`

~~~tsx
"use client";

import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroNavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getInitials } from "@/lib/utils";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { notifications } from "@/data/mock";

interface NavbarProps {
  userName: string;
  userEmail: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Navbar({ userName, userEmail, onMenuClick, showMenuButton = false }: NavbarProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <HeroNavbar
      maxWidth="full"
      className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md"
      height="4rem"
    >
      <NavbarContent justify="start">
        {showMenuButton && (
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              onPress={onMenuClick}
              aria-label="Open menu"
              className="text-text-secondary"
            >
              <Menu size={20} />
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-1">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" aria-label="Notifications" className="text-text-secondary">
                <Badge content={unreadCount} color="danger" size="sm" isInvisible={unreadCount === 0}>
                  <Bell size={20} />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notifications"
              className="w-80 rounded-card border border-border bg-surface-card shadow-card"
            >
              {notifications.map((n) => (
                <DropdownItem key={n.id} description={n.message} className="py-2">
                  {n.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" className="gap-2 px-2">
                <Avatar
                  name={userName}
                  size="sm"
                  classNames={{ base: "bg-primary/10 text-primary" }}
                  getInitials={getInitials}
                />
                <span className="hidden text-sm font-medium text-text-primary md:inline">{userName}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu" className="rounded-card border border-border bg-surface-card">
              <DropdownItem key="profile" startContent={<User size={16} />} description={userEmail}>
                Profile
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Settings size={16} />}>
                Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                startContent={<LogOut size={16} />}
                color="danger"
                className="text-danger"
                href="/login"
                as={Link}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
~~~

### `components/layout/portal-navbar.tsx`

~~~tsx
"use client";

import { Avatar } from "@heroui/react";
import { cn, getInitials } from "@/lib/utils";
import type { NavItem } from "@/types";
import { GraduationCap, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PortalNavbarProps {
  items: NavItem[];
  userName: string;
  userRoleBadge: string;
  modeBadge?: string;
  onMenuClick?: () => void;
}

export function PortalNavbar({
  items,
  userName,
  userRoleBadge,
  modeBadge,
  onMenuClick,
}: PortalNavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-button p-2 text-text-secondary hover:bg-surface-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2.5">
            <GraduationCap size={22} className="shrink-0 text-primary" strokeWidth={1.75} />
            <span className="hidden font-serif text-base font-bold text-text-primary sm:inline md:text-lg">
              Intern &amp; Training Portal
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/supervisor/dashboard" &&
                item.href !== "/student/dashboard" &&
                item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.id ?? item.href}
                href={item.href}
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-widest transition-colors",
                  isActive
                    ? "border-b-2 border-primary pb-0.5 text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {modeBadge && (
            <span className="hidden rounded-full border border-border bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-secondary sm:inline">
              {modeBadge}
            </span>
          )}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-text-primary">{userName}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              {userRoleBadge}
            </p>
          </div>
          <Avatar
            name={getInitials(userName)}
            size="sm"
            classNames={{
              base: "h-10 w-10 bg-surface-muted text-text-primary ring-2 ring-border",
            }}
            getInitials={getInitials}
          />
        </div>
      </div>
    </header>
  );
}
~~~

### `components/layout/sidebar.tsx`

~~~tsx
"use client";

import { Button } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { GraduationCap, PanelLeft, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  items: NavItem[];
  roleLabel: string;
  userName?: string;
  userRoleBadge?: string;
  portalTitle?: string;
  consoleTitle?: string;
  consoleVersion?: string;
  variant?: "default" | "portal";
  collapsed?: boolean;
  sidebarCollapsed?: boolean;
  onToggle?: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({
  items,
  roleLabel,
  portalTitle = "Intern & Industrial Training Portal",
  consoleTitle,
  consoleVersion,
  variant = "default",
  collapsed = false,
  sidebarCollapsed = false,
  onToggle,
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const isPortal = variant === "portal";
  const isCollapsed = mobile ? false : collapsed;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-surface-sidebar font-sans transition-all duration-300",
        mobile ? "flex w-[260px]" : "hidden lg:flex",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-border/60",
          isCollapsed ? "justify-center px-2 py-4" : "justify-between gap-2 px-4 py-4"
        )}
      >
        {!isCollapsed && (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-primary/10 text-primary">
              <GraduationCap size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              {isPortal && consoleTitle ? (
                <>
                  <p className="truncate text-base font-semibold leading-snug text-text-primary">
                    {consoleTitle}
                  </p>
                  {consoleVersion && (
                    <p className="truncate text-sm text-text-secondary">{consoleVersion}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="truncate text-base font-semibold text-text-primary">
                    {isPortal ? portalTitle : "IITS"}
                  </p>
                  <p className="truncate text-sm text-text-secondary">{roleLabel}</p>
                </>
              )}
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-button bg-primary/10 text-primary">
            <GraduationCap size={20} strokeWidth={1.75} />
          </div>
        )}

        {onToggle && !mobile && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="lg"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onPress={onToggle}
            className={cn("shrink-0 text-text-secondary", isCollapsed && "mt-0")}
          >
            {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/supervisor/dashboard" &&
              item.href !== "/admin/dashboard" &&
              item.href !== "/student/dashboard" &&
              pathname.startsWith(`${item.href}`));
          return (
            <Link
              key={item.id ?? item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-button px-3 py-3 text-base font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <DynamicIcon name={item.icon} size={20} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isPortal && !isCollapsed && (
        <div className="border-t border-border px-4 py-4">
          <div className="flex gap-4 text-sm font-medium text-text-secondary">
            <button type="button" className="hover:text-text-primary">
              Help
            </button>
            <button type="button" className="hover:text-text-primary">
              Support
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
~~~

### `components/notifications/notification-panel.tsx`

~~~tsx
"use client";

import { useAppStore } from "@/lib/store/app-store";
import { cn, formatDate } from "@/lib/utils";
import type { AppNotification, NotificationAudience } from "@/types";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Bell, CheckCheck } from "lucide-react";

const categoryLabels: Record<string, string> = {
  report_submitted: "Report",
  report_reviewed: "Review",
  report_accepted: "Accepted",
  report_rejected: "Rejected",
  report_feedback: "Feedback",
  deadline: "Deadline",
  internship: "Internship",
  profile: "Profile",
  announcement: "Announcement",
  company: "Directory",
  general: "General",
};

interface NotificationPanelProps {
  audience: NotificationAudience;
  userId?: string;
}

export function NotificationPanel({ audience, userId }: NotificationPanelProps) {
  const {
    getNotificationsFor,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppStore();

  const items = getNotificationsFor(audience, userId);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="lg"
          aria-label="Notifications"
          className="text-text-secondary"
        >
          <Badge content={unread} color="danger" size="sm" isInvisible={unread === 0}>
            <Bell size={20} />
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notifications"
        className="max-h-[min(70vh,480px)] w-[min(100vw-2rem,380px)] overflow-y-auto rounded-card border border-border bg-surface-card p-0 font-sans shadow-card"
        emptyContent={
          <p className="px-4 py-8 text-center text-sm text-text-secondary">No notifications</p>
        }
        topContent={
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-base font-semibold text-text-primary">Notifications</p>
            {unread > 0 && (
              <Button
                size="sm"
                variant="light"
                startContent={<CheckCheck size={14} />}
                onPress={() => markAllNotificationsRead(audience, userId)}
              >
                Mark all read
              </Button>
            )}
          </div>
        }
      >
        {items.map((n) => (
          <DropdownItem
            key={n.id}
            textValue={n.title}
            className={cn("px-0", !n.read && "bg-primary/5")}
            onPress={() => markNotificationRead(n.id)}
          >
            <NotificationRow notification={n} />
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

function NotificationRow({ notification: n }: { notification: AppNotification }) {
  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-sm font-semibold text-text-primary", !n.read && "text-primary")}>
          {n.title}
        </p>
        {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
        {categoryLabels[n.category] ?? n.category}
      </p>
      <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{n.message}</p>
      <p className="mt-2 text-xs text-text-secondary">
        {formatDate(n.createdAt)} Â· {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
~~~

### `components/providers.tsx`

~~~tsx
"use client";

import { AppStoreProvider } from "@/lib/store/app-store";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        <ToastProvider placement="top-right" toastOffset={16} />
        <AppStoreProvider>{children}</AppStoreProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
~~~

### `components/reports/pdf-viewer.tsx`

~~~tsx
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
~~~

### `components/reports/report-status-badge.tsx`

~~~tsx
"use client";

import { cn } from "@/lib/utils";
import type { LogbookReportStatus } from "@/types";

const config: Record<
  LogbookReportStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#FFF3E0] text-[#E65100]",
  },
  unreviewed: {
    label: "Unreviewed",
    className: "bg-surface-muted text-text-secondary",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-[#E3F2FD] text-[#1565C0]",
  },
  accepted: {
    label: "Accepted",
    className: "bg-[#E8F5E9] text-[#2E7D32]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#FFEBEE] text-[#C62828]",
  },
};

export function ReportStatusBadge({
  status,
  className,
}: {
  status: LogbookReportStatus;
  className?: string;
}) {
  const { label, className: statusClass } = config[status];
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        statusClass,
        className
      )}
    >
      {label}
    </span>
  );
}
~~~

### `components/student/portal-page-header.tsx`

~~~tsx
"use client";

import { cn } from "@/lib/utils";

interface PortalPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PortalPageHeader({ title, description, action, className }: PortalPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
~~~

### `components/supervisor/bulk-action-bar.tsx`

~~~tsx
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
~~~

### `components/supervisor/internship-status-pill.tsx`

~~~tsx
"use client";

import { cn } from "@/lib/utils";
import type { InternshipPlacementStatus } from "@/types";

const statusConfig: Record<
  InternshipPlacementStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  active: {
    label: "Active",
    dot: "bg-[#4CAF50]",
    text: "text-[#2E7D32]",
    bg: "bg-[#E8F5E9]",
  },
  pending: {
    label: "Pending",
    dot: "bg-[#FF9800]",
    text: "text-[#E65100]",
    bg: "bg-[#FFF3E0]",
  },
  not_placed: {
    label: "Not Placed",
    dot: "bg-danger",
    text: "text-danger",
    bg: "bg-[#FCEAEA]",
  },
};

interface InternshipStatusPillProps {
  status: InternshipPlacementStatus;
}

export function InternshipStatusPill({ status }: InternshipStatusPillProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
~~~

### `components/ui/app-modal.tsx`

~~~tsx
"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function AppModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "lg",
}: AppModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      scrollBehavior="inside"
      radius="lg"
      placement="center"
      isDismissable
      classNames={{
        wrapper: "z-[100] items-end p-0 sm:items-center sm:p-4",
        base: "m-0 max-h-[92dvh] w-full rounded-none sm:m-auto sm:max-h-[85vh] sm:rounded-card",
      }}
    >
      <ModalContent className="rounded-card border border-border bg-surface-card shadow-card">
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 pr-8 text-base text-text-primary sm:text-lg">
              {title}
            </ModalHeader>
            <ModalBody className="text-text-secondary">{children}</ModalBody>
            {footer && (
              <ModalFooter className="flex flex-wrap gap-2 border-t border-border/60">
                {footer}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
~~~

### `components/ui/dynamic-icon.tsx`

~~~tsx
"use client";

import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle,
  ClipboardList,
  Clock,
  FileCheck,
  FileText,
  FolderTree,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Rocket,
  Settings,
  TrendingUp,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  User,
  FileText,
  ClipboardList,
  Briefcase,
  BookOpen,
  Users,
  FileCheck,
  BarChart3,
  GraduationCap,
  FolderTree,
  UserCheck,
  Building2,
  Settings,
  CheckCircle,
  TrendingUp,
  Clock,
  Rocket,
  Megaphone,
  AlertCircle,
};

export function DynamicIcon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = iconMap[name] ?? LayoutDashboard;
  return <Icon className={className} size={size} />;
}
~~~

### `components/ui/page-header.tsx`

~~~tsx
"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="ds-page-title">{title}</h1>
        {description && <p className="ds-page-description">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

interface ContentCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, description, action, children, className }: ContentCardProps) {
  return (
    <Card className={cn("ds-card ds-card-hover rounded-card", className)}>
      {(title || action) && (
        <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
            {description && <p className="text-sm text-text-secondary">{description}</p>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardBody className="p-6">{children}</CardBody>
    </Card>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-card bg-surface-sidebar text-text-secondary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
~~~

### `components/ui/pagination-bar.tsx`

~~~tsx
"use client";

import { Pagination } from "@heroui/react";

interface PaginationBarProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

export function PaginationBar({ page, total, onChange, className }: PaginationBarProps) {
  if (total <= 1) return null;

  return (
    <div className={className}>
      <Pagination
        page={page}
        total={total}
        onChange={onChange}
        showControls
        color="primary"
        variant="flat"
        radius="lg"
      />
    </div>
  );
}
~~~

### `components/ui/search-bar.tsx`

~~~tsx
"use client";

import { Input } from "@heroui/react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={value}
      onValueChange={onChange}
      startContent={<Search className="text-text-secondary" size={18} />}
      variant="bordered"
      radius="lg"
      size="md"
      isClearable
      onClear={() => onChange("")}
      classNames={{
        inputWrapper: "border-border bg-surface-card shadow-none rounded-input",
        input: "text-text-primary placeholder:text-text-secondary",
      }}
    />
  );
}
~~~

### `components/ui/stat-card.tsx`

~~~tsx
"use client";

import { Card, CardBody } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const TrendIcon =
    stat.trend === "up" ? ArrowUpRight : stat.trend === "down" ? ArrowDownRight : Minus;

  const trendColor =
    stat.trend === "up"
      ? "text-success"
      : stat.trend === "down"
        ? "text-danger"
        : "text-text-secondary";

  return (
    <Card
      className={cn(
        "animate-fade-in rounded-card border border-border bg-surface-card shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <CardBody className="gap-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">{stat.value}</p>
            {stat.change && (
              <span className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", trendColor)}>
                <TrendIcon size={14} />
                {stat.change}
              </span>
            )}
          </div>
          <div className="ds-icon-badge h-11 w-11">
            <DynamicIcon name={stat.icon} size={22} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
~~~

### `components/ui/status-badge.tsx`

~~~tsx
"use client";

import { Chip } from "@heroui/react";
import { capitalize, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  return (
    <Chip color={getStatusColor(status)} variant="flat" size={size}>
      {capitalize(status)}
    </Chip>
  );
}
~~~

### `components/ui/table-scroll.tsx`

~~~tsx
"use client";

import { cn } from "@/lib/utils";

/** Horizontal scroll wrapper for data tables on small screens */
export function TableScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("-mx-2 overflow-x-auto px-2 sm:mx-0 sm:px-0", className)}>
      <div className="min-w-[640px]">{children}</div>
    </div>
  );
}
~~~

### `components/ui/theme-toggle.tsx`

~~~tsx
"use client";

import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        size="sm"
        aria-label="Toggle theme"
        className="text-text-secondary"
      />
    );
  }

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      aria-label="Toggle theme"
      className="text-text-secondary hover:text-text-primary"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
~~~

### `data/mock.ts`

~~~ts
import type {
  Application,
  Company,
  DashboardStat,
  Internship,
  Notification,
  MonthlyReport,
  ProgressReport,
  Review,
  Student,
  Supervisor,
  SystemSetting,
} from "@/types";

export const currentStudent: Student = {
  id: "stu-001",
  name: "Alex Morgan",
  email: "alex.morgan@university.edu",
  role: "student",
  studentId: "ENG-2024-001",
  program: "Information Management",
  year: 3,
  gpa: 3.75,
  phone: "+1 (555) 123-4567",
  department: "Faculty of Engineering",
  departmentCode: "IMGT",
  batch: "2024",
  internshipStatus: "active",
  avatar: "",
  cvUrl: "/uploads/sarah-johnson-cv.pdf",
  supervisorId: "sup-001",
  createdAt: "2024-09-01",
};

export const currentSupervisor: Supervisor = {
  id: "sup-001",
  name: "Dr. Sarah Chen",
  email: "s.chen@university.edu",
  role: "supervisor",
  title: "Faculty Supervisor",
  phone: "+1 (555) 987-6543",
  department: "Applied Sciences",
  assignedStudents: 128,
  createdAt: "2020-01-15",
};

export const supervisorConsoleMeta = {
  facultyName: "Engineering Faculty",
  consoleTitle: "Applied Sciences Console",
  consoleVersion: "v1.1",
};

export const currentAdmin = {
  id: "adm-001",
  name: "Alex Morgan",
  email: "alex.morgan@university.edu",
  role: "admin" as const,
  permissions: ["all"],
  createdAt: "2019-06-01",
};

export const adminConsoleMeta = {
  consoleTitle: "Applied Sciences Console",
  consoleVersion: "v1.1",
};

export const adminFacultyDashboard = {
  title: "Applied Sciences Faculty Dashboard",
  subtitle:
    "Overview of student placements and faculty performance for Academic Year 2024.",
  totalStudents: 1248,
  departments: [
    { name: "Comp Science", count: 412 },
    { name: "Electrical", count: 298 },
    { name: "Mathematical", count: 315 },
    { name: "Industrial", count: 223 },
  ],
  activeInternships: {
    value: 856,
    trend: "12% increase from last term",
  },
  pendingReviews: {
    value: 42,
    detail: "Average response time: 2.4 days",
  },
  actionRequired: [
    {
      id: "act-001",
      label: "Unassigned Students",
      detail: "15 students",
      severity: "danger" as const,
      href: "/admin/supervisor-student-directory",
    },
    {
      id: "act-002",
      label: "Overdue Logbooks",
      detail: "28 entries",
      severity: "danger" as const,
      href: "/admin/reports",
    },
    {
      id: "act-003",
      label: "MOU Expiration",
      detail: "3 partner companies",
      severity: "warning" as const,
      href: "/admin/companies",
    },
  ],
};

export const students: Student[] = [
  currentStudent,
  {
    id: "stu-002",
    name: "Marcus Adebayo",
    email: "marcus.a@university.edu",
    role: "student",
    studentId: "ENG-2024-042",
    program: "Electronics Engineering",
    year: 4,
    gpa: 3.5,
    phone: "+1 (555) 234-5678",
    department: "Faculty of Engineering",
    departmentCode: "Electronics",
    batch: "2024",
    internshipStatus: "pending",
    supervisorId: "sup-001",
    createdAt: "2024-09-01",
  },
  {
    id: "stu-003",
    name: "Sophie Laurent",
    email: "sophie.l@university.edu",
    role: "student",
    studentId: "ENG-2024-015",
    program: "Information Management",
    year: 3,
    gpa: 3.9,
    phone: "+1 (555) 345-6789",
    department: "Faculty of Engineering",
    departmentCode: "IMGT",
    batch: "2023",
    internshipStatus: "active",
    supervisorId: "sup-002",
    createdAt: "2024-09-01",
  },
  {
    id: "stu-004",
    name: "David Kim",
    email: "david.k@university.edu",
    role: "student",
    studentId: "ENG-2024-088",
    program: "Computer Science",
    year: 2,
    gpa: 3.2,
    phone: "+1 (555) 456-7890",
    department: "Faculty of Engineering",
    departmentCode: "CS",
    batch: "2024",
    internshipStatus: "not_placed",
    supervisorId: "sup-001",
    createdAt: "2024-09-01",
  },
  {
    id: "stu-005",
    name: "James Wilson",
    email: "james.w@university.edu",
    role: "student",
    studentId: "ENG-2024-033",
    program: "Information Technology",
    year: 4,
    gpa: 3.6,
    department: "Faculty of Engineering",
    departmentCode: "IT",
    batch: "2024",
    internshipStatus: "active",
    supervisorId: "sup-001",
    createdAt: "2024-09-01",
  },
  {
    id: "stu-006",
    name: "Emily Davis",
    email: "emily.d@university.edu",
    role: "student",
    studentId: "ENG-2024-021",
    program: "Software Engineering",
    year: 3,
    gpa: 3.8,
    department: "Faculty of Engineering",
    departmentCode: "SE",
    batch: "2024",
    internshipStatus: "pending",
    supervisorId: "sup-001",
    createdAt: "2024-09-01",
  },
  {
    id: "stu-007",
    name: "Aisha Patel",
    email: "aisha.p@university.edu",
    role: "student",
    studentId: "ENG-2024-056",
    program: "Electronics Engineering",
    year: 3,
    gpa: 3.4,
    department: "Faculty of Engineering",
    departmentCode: "Electronics",
    batch: "2023",
    internshipStatus: "active",
    supervisorId: "sup-001",
    createdAt: "2024-09-01",
  },
  {
    id: "stu-008",
    name: "Noah Thompson",
    email: "noah.t@university.edu",
    role: "student",
    studentId: "ENG-2024-072",
    program: "Information Management",
    year: 2,
    gpa: 3.1,
    department: "Faculty of Engineering",
    departmentCode: "IMGT",
    batch: "2024",
    internshipStatus: "not_placed",
    supervisorId: "sup-001",
    createdAt: "2024-09-01",
  },
];

/** University registry â€” students eligible for directory lookup but not yet added */
export const studentRegistry: Student[] = [
  {
    id: "reg-001",
    name: "Ryan Cooper",
    email: "ryan.cooper@university.edu",
    role: "student",
    studentId: "ENG-2024-099",
    program: "Computer Science",
    year: 3,
    gpa: 3.55,
    phone: "+1 (555) 111-2233",
    department: "Faculty of Engineering",
    departmentCode: "CMIS",
    batch: "2024",
    internshipStatus: "not_placed",
    createdAt: "2024-09-01",
  },
  {
    id: "reg-002",
    name: "Priya Nair",
    email: "priya.nair@university.edu",
    role: "student",
    studentId: "ENG-2024-110",
    program: "Management Studies",
    year: 2,
    gpa: 3.7,
    phone: "+1 (555) 222-3344",
    department: "Faculty of Engineering",
    departmentCode: "Management",
    batch: "2025",
    internshipStatus: "not_placed",
    createdAt: "2024-09-01",
  },
];

export const supervisors: Supervisor[] = [
  currentSupervisor,
  {
    id: "sup-002",
    name: "Prof. Lisa Anderson",
    email: "l.anderson@university.edu",
    role: "supervisor",
    title: "Associate Professor",
    phone: "+1 (555) 876-5432",
    department: "Information Technology",
    assignedStudents: 8,
    createdAt: "2018-03-20",
  },
  {
    id: "sup-003",
    name: "Dr. Robert Taylor",
    email: "r.taylor@university.edu",
    role: "supervisor",
    title: "Lecturer",
    phone: "+1 (555) 765-4321",
    department: "Software Engineering",
    assignedStudents: 10,
    createdAt: "2021-08-10",
  },
];

export const companies: Company[] = [
  {
    id: "com-001",
    name: "TechNova Solutions",
    industry: "Technology",
    location: "San Francisco, CA",
    email: "careers@technova.com",
    phone: "+1 (555) 111-2222",
    website: "https://technova.com",
    status: "approved",
    companyLetter: "MOU-2024-A",
    description: "Leading software development company specializing in enterprise solutions.",
    createdAt: "2024-01-15",
  },
  {
    id: "com-002",
    name: "DataFlow Analytics",
    industry: "Data Science",
    location: "New York, NY",
    email: "internships@dataflow.io",
    phone: "+1 (555) 333-4444",
    website: "https://dataflow.com",
    status: "approved",
    companyLetter: "MOU-2024-B",
    description: "Data analytics and machine learning consultancy.",
    createdAt: "2024-02-20",
  },
  {
    id: "com-003",
    name: "GreenEnergy Corp",
    industry: "Energy",
    location: "Austin, TX",
    email: "hr@greenenergy.com",
    phone: "+1 (555) 555-6666",
    status: "pending",
    companyLetter: "MOU-2024-C",
    description: "Renewable energy solutions provider.",
    createdAt: "2024-11-01",
  },
  {
    id: "com-004",
    name: "FinServe Global",
    industry: "Finance",
    location: "Chicago, IL",
    email: "talent@finserve.com",
    phone: "+1 (555) 777-8888",
    website: "https://finserve.com",
    status: "approved",
    companyLetter: "MOU-2024-D",
    description: "Financial services and fintech innovation.",
    createdAt: "2024-03-10",
  },
];

export const internships: Internship[] = [
  {
    id: "int-001",
    title: "Software Engineering Intern",
    companyId: "com-001",
    companyName: "TechNova Solutions",
    location: "San Francisco, CA",
    type: "hybrid",
    duration: "3 months",
    deadline: "2025-06-30",
    description: "Join our engineering team to build scalable web applications using React and Node.js.",
    requirements: ["React", "TypeScript", "Node.js", "Git"],
    slots: 5,
    applied: 23,
    status: "open",
    stipend: "$2,500/month",
    departmentCategory: "CMIS",
  },
  {
    id: "int-002",
    title: "Data Science Intern",
    companyId: "com-002",
    companyName: "DataFlow Analytics",
    location: "New York, NY",
    type: "remote",
    duration: "4 months",
    deadline: "2025-07-15",
    description: "Work on real-world data science projects using Python, ML frameworks, and cloud platforms.",
    requirements: ["Python", "Pandas", "Scikit-learn", "SQL"],
    slots: 3,
    applied: 18,
    status: "open",
    stipend: "$3,000/month",
    departmentCategory: "IMGT",
  },
  {
    id: "int-003",
    title: "Frontend Developer Intern",
    companyId: "com-001",
    companyName: "TechNova Solutions",
    location: "San Francisco, CA",
    type: "onsite",
    duration: "3 months",
    deadline: "2025-05-31",
    description: "Build beautiful user interfaces with modern frontend technologies.",
    requirements: ["HTML/CSS", "JavaScript", "React", "Figma"],
    slots: 4,
    applied: 31,
    status: "open",
    stipend: "$2,200/month",
    departmentCategory: "CMIS",
  },
  {
    id: "int-004",
    title: "Financial Analyst Intern",
    companyId: "com-004",
    companyName: "FinServe Global",
    location: "Chicago, IL",
    type: "hybrid",
    duration: "6 months",
    deadline: "2025-08-01",
    description: "Support financial modeling, reporting, and market analysis.",
    requirements: ["Excel", "Financial Modeling", "Analytics"],
    slots: 2,
    applied: 15,
    status: "open",
    stipend: "$2,800/month",
    departmentCategory: "Management",
  },
  {
    id: "int-005",
    title: "DevOps Intern",
    companyId: "com-001",
    companyName: "TechNova Solutions",
    location: "Remote",
    type: "remote",
    duration: "3 months",
    deadline: "2025-04-30",
    description: "Learn CI/CD pipelines, containerization, and cloud infrastructure.",
    requirements: ["Docker", "AWS", "Linux", "Git"],
    slots: 2,
    applied: 12,
    status: "closed",
    stipend: "$2,600/month",
    departmentCategory: "Electronic",
  },
];

export const departmentCategories = ["CMIS", "MATH & STAT", "IMGT", "ELTN"] as const;
export const applications: Application[] = [
  {
    id: "app-001",
    studentId: "stu-001",
    studentName: "Sarah Johnson",
    internshipId: "int-001",
    internshipTitle: "Software Engineering Intern",
    companyName: "TechNova Solutions",
    status: "reviewing",
    appliedAt: "2025-03-15",
    coverLetter: "I am excited to apply for this position...",
  },
  {
    id: "app-002",
    studentId: "stu-001",
    studentName: "Sarah Johnson",
    internshipId: "int-002",
    internshipTitle: "Data Science Intern",
    companyName: "DataFlow Analytics",
    status: "pending",
    appliedAt: "2025-04-01",
  },
  {
    id: "app-003",
    studentId: "stu-002",
    studentName: "James Wilson",
    internshipId: "int-003",
    internshipTitle: "Frontend Developer Intern",
    companyName: "TechNova Solutions",
    status: "approved",
    appliedAt: "2025-02-20",
  },
  {
    id: "app-004",
    studentId: "stu-003",
    studentName: "Emily Davis",
    internshipId: "int-001",
    internshipTitle: "Software Engineering Intern",
    companyName: "TechNova Solutions",
    status: "rejected",
    appliedAt: "2025-03-01",
  },
];

export const reviews: Review[] = [
  {
    id: "rev-001",
    studentId: "stu-001",
    studentName: "Alex Morgan",
    supervisorId: "sup-001",
    title: "Monthly Report #3",
    type: "weekly",
    submittedAt: "2025-04-20",
    status: "pending",
    content: "Completed authentication module and started working on dashboard UI.",
    score: undefined,
  },
  {
    id: "rev-002",
    studentId: "stu-002",
    studentName: "James Wilson",
    supervisorId: "sup-001",
    title: "Midterm Evaluation",
    type: "midterm",
    submittedAt: "2025-04-15",
    status: "approved",
    content: "Excellent progress on frontend development tasks.",
    feedback: "Great work on component architecture. Keep it up!",
    score: 88,
  },
  {
    id: "rev-003",
    studentId: "stu-003",
    studentName: "Emily Davis",
    supervisorId: "sup-002",
    title: "Week 6 Progress Review",
    type: "weekly",
    submittedAt: "2025-04-18",
    status: "pending",
    content: "Implemented data pipeline and started ML model training.",
  },
  {
    id: "rev-004",
    studentId: "stu-004",
    studentName: "David Brown",
    supervisorId: "sup-001",
    title: "Week 2 Progress Review",
    type: "weekly",
    submittedAt: "2025-04-10",
    status: "rejected",
    content: "Initial project setup completed.",
    feedback: "Please provide more detail on tasks completed and learning outcomes.",
    score: 45,
  },
];

export const monthlyReports: MonthlyReport[] = [
  {
    id: "mr-003",
    studentId: "stu-001",
    monthNumber: 3,
    period: "Oct 2024",
    status: "pending",
    isCurrent: true,
    excerpt:
      "This month I focused on integrating the client API layer and improving test coverage across the placement module. Key milestones included completing the weekly sync with my industry mentor and documenting lessons learned in the reflective journal.",
  },
  {
    id: "mr-002",
    studentId: "stu-001",
    monthNumber: 2,
    period: "Sep 2024",
    status: "reviewed",
    rating: 5,
    feedback:
      "Excellent reflective depth and clear evidence of professional growth. Your analysis of stakeholder communication was particularly strong.",
    excerpt:
      "Expanded responsibilities in the product team, led a small UX review session, and delivered the mid-month progress presentation to supervisors.",
  },
  {
    id: "mr-001",
    studentId: "stu-001",
    monthNumber: 1,
    period: "Aug 2024",
    status: "reviewed",
    rating: 4,
    feedback:
      "Solid first submission. Consider adding more quantitative outcomes in your next report.",
    excerpt:
      "Completed onboarding, shadowed senior developers, and contributed to documentation updates for the internal training wiki.",
  },
];

export const studentReportProgress = {
  completed: 3,
  total: 6,
};

export const progressReports: ProgressReport[] = [
  {
    id: "pr-001",
    studentId: "stu-001",
    studentName: "Alex Morgan",
    week: 4,
    submittedAt: "2025-04-20",
    status: "pending",
    summary: "Focused on building the authentication flow and user dashboard.",
    achievements: ["Completed login/register pages", "Set up routing", "Integrated mock API"],
    challenges: ["Understanding OAuth flow", "State management complexity"],
  },
  {
    id: "pr-002",
    studentId: "stu-002",
    studentName: "James Wilson",
    week: 8,
    submittedAt: "2025-04-15",
    status: "approved",
    summary: "Mid-internship progress on frontend development.",
    achievements: ["Built 5 reusable components", "Implemented responsive design"],
    challenges: ["Cross-browser compatibility"],
  },
];

export const notifications: Notification[] = [
  {
    id: "not-001",
    audience: "student",
    userId: "stu-001",
    title: "Application Update",
    message: "Your application for Software Engineering Intern is under review.",
    read: false,
    createdAt: "2025-04-22T10:30:00",
    type: "info",
    category: "internship",
  },
  {
    id: "not-002",
    audience: "student",
    userId: "stu-001",
    title: "New Internship Posted",
    message: "DataFlow Analytics posted a new Data Science Intern position.",
    read: false,
    createdAt: "2025-04-21T14:00:00",
    type: "success",
    category: "internship",
  },
  {
    id: "not-003",
    audience: "supervisor",
    userId: "sup-001",
    title: "Review Required",
    message: "Sarah Johnson submitted a Week 4 progress review.",
    read: true,
    createdAt: "2025-04-20T09:15:00",
    type: "warning",
    category: "report_submitted",
  },
];

export const studentDashboardStats: DashboardStat[] = [
  { label: "Applications", value: 3, change: "+1 this month", trend: "up", icon: "ClipboardList" },
  { label: "Active Internships", value: 12, change: "5 new posted", trend: "up", icon: "Briefcase" },
  { label: "Pending Reviews", value: 1, change: "Due in 3 days", trend: "neutral", icon: "Clock" },
  { label: "Profile Completion", value: "85%", change: "+10% this week", trend: "up", icon: "User" },
];

export const studentPortalDashboard = {
  activeCompany: "TechCorp",
  reportProgress: {
    percent: 50,
    monthsCompleted: 3,
    monthsRemaining: 3,
  },
  /** @deprecated use reportProgress */
  internshipProgress: {
    percent: 50,
    monthsCompleted: 3,
    monthsRemaining: 3,
  },
  nextReport: {
    date: "Oct 12",
    type: "Reflective Journal",
  },
  activities: [
    {
      id: "act-001",
      title: "Monthly Report",
      description: "Submitted for April. Waiting for review.",
      time: "2 HOURS AGO",
      icon: "CheckCircle" as const,
      iconBg: "bg-[#E8F0EA]",
      iconColor: "text-[#5A7A62]",
    },
    {
      id: "act-002",
      title: "New Feedback",
      description: "Supervisor left feedback on March Report.",
      time: "YESTERDAY",
      icon: "MessageSquare" as const,
      iconBg: "bg-[#F4EDE6]",
      iconColor: "text-primary",
    },
    {
      id: "act-003",
      title: "Upcoming Deadline",
      description: "Skill assessment closes in 24 hours.",
      time: "1 DAY AGO",
      icon: "AlertCircle" as const,
      iconBg: "bg-[#FCEAEA]",
      iconColor: "text-danger",
    },
  ],
  newOpportunities: 8,
  workshop: {
    title: "Resume Workshop",
    description: "Join industry experts next Monday at 10:00 AM to polish your portfolio.",
  },
};

export const supervisorDashboardStats: DashboardStat[] = [
  { label: "Assigned Students", value: 12, change: "+2 this semester", trend: "up", icon: "Users" },
  { label: "Pending Reviews", value: 5, change: "2 overdue", trend: "down", icon: "FileCheck" },
  { label: "Approved This Month", value: 8, change: "+3 from last month", trend: "up", icon: "CheckCircle" },
];

export const adminDashboardStats: DashboardStat[] = [
  { label: "Total Students", value: 248, change: "+12 this month", trend: "up", icon: "GraduationCap" },
  { label: "Active Internships", value: 34, change: "8 closing soon", trend: "neutral", icon: "Briefcase" },
  { label: "Pending Companies", value: 3, change: "Needs approval", trend: "warning" as "up", icon: "Building2" },
  { label: "Applications", value: 156, change: "+28 this week", trend: "up", icon: "FileText" },
];

export const systemSettings: SystemSetting[] = [
  {
    id: "set-001",
    label: "Application Deadline Reminder",
    description: "Send reminder emails before internship deadlines",
    value: true,
    type: "boolean",
  },
  {
    id: "set-002",
    label: "Max Applications Per Student",
    description: "Maximum number of concurrent applications allowed",
    value: 5,
    type: "number",
  },
  {
    id: "set-003",
    label: "Academic Year",
    description: "Current academic year for the training program",
    value: "2024/2025",
    type: "text",
  },
  {
    id: "set-004",
    label: "Default Internship Duration",
    description: "Standard duration for internship placements",
    value: "3 months",
    type: "select",
    options: ["1 month", "2 months", "3 months", "6 months"],
  },
  {
    id: "set-005",
    label: "Allow Self Registration",
    description: "Enable students to register without admin approval",
    value: true,
    type: "boolean",
  },
  {
    id: "set-006",
    label: "Review Submission Deadline",
    description: "Days after week end to submit progress reports",
    value: 3,
    type: "number",
  },
];

export const analyticsData = {
  monthlyApplications: [
    { month: "Jan", count: 45 },
    { month: "Feb", count: 52 },
    { month: "Mar", count: 68 },
    { month: "Apr", count: 78 },
    { month: "May", count: 91 },
  ],
  statusDistribution: [
    { status: "Approved", count: 45, color: "#4CAF50" },
    { status: "Pending", count: 32, color: "#FF9800" },
    { status: "Reviewing", count: 28, color: "#B35A1F" },
    { status: "Rejected", count: 15, color: "#EF4444" },
  ],
  topCompanies: [
    { name: "TechNova Solutions", applications: 45 },
    { name: "DataFlow Analytics", applications: 32 },
    { name: "FinServe Global", applications: 28 },
    { name: "GreenEnergy Corp", applications: 15 },
  ],
};
~~~

### `database/README.md`

~~~md
~~~

### `lib/api.ts`

~~~ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Request failed");
  return json;
}

// â”€â”€â”€ Users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function apiUpdateUser(id: string, patch: Record<string, unknown>) {
  return request(`/users/${id}`, { method: "PUT", body: JSON.stringify(patch) });
}

export async function apiCreateUser(payload: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteUser(id: string) {
  return request(`/users/${id}`, { method: "DELETE" });
}

// â”€â”€â”€ File upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function apiUploadFile(file: File): Promise<{ url: string; path: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/uploads`, { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Upload failed");
  return { url: json.url, path: json.path };
}

// â”€â”€â”€ Logbook reports â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function apiCreateLogbookReport(payload: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>("/logbook_reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateLogbookReport(id: string, patch: Record<string, unknown>) {
  return request(`/logbook_reports/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function apiDeleteLogbookReport(id: string) {
  return request(`/logbook_reports/${id}`, { method: "DELETE" });
}
~~~

### `lib/components/auth/auth-layout.tsx`

~~~tsx
"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-500 via-brand-600 to-brand-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-button bg-white/20 backdrop-blur">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-lg font-bold">IITS</p>
            <p className="text-sm text-white/70">Wayamba University of Sri Lanka</p>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Streamline your
            <br />
            internship journey
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Connect students, supervisors, and companies in one unified platform for
            industrial training management.
          </p>
        </div>

        <p className="text-sm text-white/50">Â© 2026 Intern & Industrial Training System</p>
      </div>

      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-button bg-primary text-white shadow-card">
                <GraduationCap size={20} />
              </div>
              <span className="text-lg font-bold text-text-primary">IITS</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
            <p className="mt-2 text-text-secondary">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
~~~

### `lib/components/layout/dashboard-layout.tsx`

~~~tsx
"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { Menu } from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  userEmail: string;
  variant?: "default" | "portal";
  userRoleBadge?: string;
}

export function DashboardLayout({
  children,
  navItems,
  roleLabel,
  userName,
  userEmail,
  variant = "default",
  userRoleBadge,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPortal = variant === "portal";
  const sidebarWidth = collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]";

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        items={navItems}
        collapsed={collapsed}
        onToggle={isPortal ? undefined : () => setCollapsed(!collapsed)}
        roleLabel={roleLabel}
        userName={userName}
        userRoleBadge={userRoleBadge}
        variant={variant}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          items={navItems}
          roleLabel={roleLabel}
          userName={userName}
          userRoleBadge={userRoleBadge}
          variant={variant}
        />
      </div>

      <div className={cn("flex min-h-screen flex-col transition-all duration-300", sidebarWidth)}>
        {!isPortal && (
          <Navbar
            userName={userName}
            userEmail={userEmail}
            showMenuButton
            onMenuClick={() => setMobileOpen(!mobileOpen)}
          />
        )}

        {isPortal && (
          <div className="flex items-center border-b border-border px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-button p-2 text-text-secondary hover:bg-surface-muted"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        )}

        <main className={cn("flex-1", isPortal ? "p-6 lg:p-8 xl:p-10" : "p-4 md:p-6 lg:p-8")}>
          <div className="animate-slide-up mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
~~~

### `lib/components/layout/navbar.tsx`

~~~tsx
"use client";

import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroNavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getInitials } from "@/lib/utils";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { notifications } from "@/data/mock";

interface NavbarProps {
  userName: string;
  userEmail: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Navbar({ userName, userEmail, onMenuClick, showMenuButton = false }: NavbarProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <HeroNavbar
      maxWidth="full"
      className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md"
      height="4rem"
    >
      <NavbarContent justify="start">
        {showMenuButton && (
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              onPress={onMenuClick}
              aria-label="Open menu"
              className="text-text-secondary"
            >
              <Menu size={20} />
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-1">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" aria-label="Notifications" className="text-text-secondary">
                <Badge content={unreadCount} color="danger" size="sm" isInvisible={unreadCount === 0}>
                  <Bell size={20} />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notifications"
              className="w-80 rounded-card border border-border bg-surface-card shadow-card"
            >
              {notifications.map((n) => (
                <DropdownItem key={n.id} description={n.message} className="py-2">
                  {n.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" className="gap-2 px-2">
                <Avatar
                  name={userName}
                  size="sm"
                  classNames={{ base: "bg-primary/10 text-primary" }}
                  getInitials={getInitials}
                />
                <span className="hidden text-sm font-medium text-text-primary md:inline">{userName}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu" className="rounded-card border border-border bg-surface-card">
              <DropdownItem key="profile" startContent={<User size={16} />} description={userEmail}>
                Profile
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Settings size={16} />}>
                Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                startContent={<LogOut size={16} />}
                color="danger"
                className="text-danger"
                href="/login"
                as={Link}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
~~~

### `lib/components/layout/sidebar.tsx`

~~~tsx
"use client";

import { Avatar } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn, getInitials } from "@/lib/utils";
import type { NavItem } from "@/types";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  items: NavItem[];
  roleLabel: string;
  userName?: string;
  userRoleBadge?: string;
  portalTitle?: string;
  variant?: "default" | "portal";
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  items,
  roleLabel,
  userName,
  userRoleBadge,
  portalTitle = "Intern & Industrial Training Portal",
  variant = "default",
  collapsed = false,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const isPortal = variant === "portal";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border transition-all duration-300",
        isPortal ? "bg-surface-sidebar" : "bg-surface-sidebar",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className={cn("px-5 pt-6", isPortal ? "pb-8" : "border-b border-border pb-4")}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center text-primary",
              isPortal ? "h-8 w-8" : "h-9 w-9 rounded-button bg-primary text-white shadow-card"
            )}
          >
            <GraduationCap size={isPortal ? 28 : 20} strokeWidth={isPortal ? 1.75 : 2} />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              {isPortal ? (
                <p className="font-serif text-[15px] font-bold leading-snug text-text-primary">
                  {portalTitle}
                </p>
              ) : (
                <>
                  <p className="truncate text-sm font-bold text-text-primary">IITS</p>
                  <p className="truncate text-xs text-text-secondary">{roleLabel}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-button px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <DynamicIcon name={item.icon} size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isPortal && userName && !collapsed && (
        <div className="border-t border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <Avatar
              name={getInitials(userName)}
              size="sm"
              classNames={{
                base: "h-10 w-10 bg-surface-muted text-text-primary ring-2 ring-border",
              }}
              getInitials={getInitials}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{userName}</p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {userRoleBadge ?? roleLabel}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
~~~

### `lib/components/providers.tsx`

~~~tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
~~~

### `lib/components/student/portal-page-header.tsx`

~~~tsx
"use client";

import { cn } from "@/lib/utils";

interface PortalPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PortalPageHeader({ title, description, action, className }: PortalPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
~~~

### `lib/components/ui/app-modal.tsx`

~~~tsx
"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function AppModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "lg",
}: AppModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} scrollBehavior="inside" radius="lg">
      <ModalContent className="rounded-card border border-border bg-surface-card shadow-card">
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-text-primary">{title}</ModalHeader>
            <ModalBody className="text-text-secondary">{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
~~~

### `lib/components/ui/dynamic-icon.tsx`

~~~tsx
"use client";

import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle,
  ClipboardList,
  Clock,
  FileCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Rocket,
  Settings,
  TrendingUp,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  User,
  FileText,
  ClipboardList,
  Briefcase,
  BookOpen,
  Users,
  FileCheck,
  BarChart3,
  GraduationCap,
  UserCheck,
  Building2,
  Settings,
  CheckCircle,
  TrendingUp,
  Clock,
  Rocket,
  AlertCircle,
};

export function DynamicIcon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = iconMap[name] ?? LayoutDashboard;
  return <Icon className={className} size={size} />;
}
~~~

### `lib/components/ui/page-header.tsx`

~~~tsx
"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="ds-page-title">{title}</h1>
        {description && <p className="ds-page-description">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

interface ContentCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, description, action, children, className }: ContentCardProps) {
  return (
    <Card className={cn("ds-card ds-card-hover rounded-card", className)}>
      {(title || action) && (
        <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
            {description && <p className="text-sm text-text-secondary">{description}</p>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardBody className="p-6">{children}</CardBody>
    </Card>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-card bg-surface-sidebar text-text-secondary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
~~~

### `lib/components/ui/pagination-bar.tsx`

~~~tsx
"use client";

import { Pagination } from "@heroui/react";

interface PaginationBarProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  className?: string;
}

export function PaginationBar({ page, total, onChange, className }: PaginationBarProps) {
  if (total <= 1) return null;

  return (
    <div className={className}>
      <Pagination
        page={page}
        total={total}
        onChange={onChange}
        showControls
        color="primary"
        variant="flat"
        radius="lg"
      />
    </div>
  );
}
~~~

### `lib/components/ui/search-bar.tsx`

~~~tsx
"use client";

import { Input } from "@heroui/react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={value}
      onValueChange={onChange}
      startContent={<Search className="text-text-secondary" size={18} />}
      variant="bordered"
      radius="lg"
      size="md"
      isClearable
      onClear={() => onChange("")}
      classNames={{
        inputWrapper: "border-border bg-surface-card shadow-none rounded-input",
        input: "text-text-primary placeholder:text-text-secondary",
      }}
    />
  );
}
~~~

### `lib/components/ui/stat-card.tsx`

~~~tsx
"use client";

import { Card, CardBody } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const TrendIcon =
    stat.trend === "up" ? ArrowUpRight : stat.trend === "down" ? ArrowDownRight : Minus;

  const trendColor =
    stat.trend === "up"
      ? "text-success"
      : stat.trend === "down"
        ? "text-danger"
        : "text-text-secondary";

  return (
    <Card
      className={cn(
        "animate-fade-in rounded-card border border-border bg-surface-card shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <CardBody className="gap-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">{stat.value}</p>
            {stat.change && (
              <span className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", trendColor)}>
                <TrendIcon size={14} />
                {stat.change}
              </span>
            )}
          </div>
          <div className="ds-icon-badge h-11 w-11">
            <DynamicIcon name={stat.icon} size={22} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
~~~

### `lib/components/ui/status-badge.tsx`

~~~tsx
"use client";

import { Chip } from "@heroui/react";
import { capitalize, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  return (
    <Chip color={getStatusColor(status)} variant="flat" size={size}>
      {capitalize(status)}
    </Chip>
  );
}
~~~

### `lib/components/ui/theme-toggle.tsx`

~~~tsx
"use client";

import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        size="sm"
        aria-label="Toggle theme"
        className="text-text-secondary"
      />
    );
  }

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      aria-label="Toggle theme"
      className="text-text-secondary hover:text-text-primary"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
~~~

### `lib/cv-storage.ts`

~~~ts
const CV_KEY = "internship-student-cv";

export function getStoredCvFileName(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CV_KEY);
}

export function setStoredCvFileName(name: string | null) {
  if (typeof window === "undefined") return;
  if (name) sessionStorage.setItem(CV_KEY, name);
  else sessionStorage.removeItem(CV_KEY);
}

export function getInitialCvFileName(fallback?: string | null): string | null {
  return getStoredCvFileName() ?? fallback ?? null;
}
~~~

### `lib/mock-api.ts`

~~~ts
import { studentRegistry, students } from "@/data/mock";

import type { Student } from "@/types";



const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));



const lookupPool = [...studentRegistry, ...students];



export async function fetchStudentByStudentId(studentId: string): Promise<Student | null> {

  await delay(700);

  const normalized = studentId.trim().toUpperCase();

  if (!normalized) return null;

  return lookupPool.find((s) => s.studentId.toUpperCase() === normalized) ?? null;

}



/** Demo IDs: registry (new) + existing students */

export const registeredStudentIds = lookupPool.map((s) => s.studentId);
~~~

### `lib/navigation.ts`

~~~ts
import type { NavItem } from "@/types";

export const studentTopNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { id: "placements", label: "Placements", href: "/student/internships", icon: "Briefcase" },
  { id: "logbook", label: "Logbook", href: "/student/reports", icon: "BookOpen" },
  { id: "profile", label: "Profile", href: "/student/profile", icon: "User" },
];

export const studentNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { id: "announcements", label: "Announcements", href: "/student/announcements", icon: "Megaphone" },
  { id: "placements", label: "Placements", href: "/student/internships", icon: "Briefcase" },
  { id: "logbook", label: "Logbook", href: "/student/reports", icon: "BookOpen" },
  { id: "companies", label: "Company Directory", href: "/student/companies", icon: "Building2" },
  { id: "cv", label: "CV Management", href: "/student/cv", icon: "FileText" },
];

export const supervisorTopNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/supervisor/dashboard", icon: "LayoutDashboard" },
  { id: "students", label: "Students", href: "/supervisor/students", icon: "GraduationCap" },
  { id: "reports", label: "Reports", href: "/supervisor/reviews", icon: "FileText" },
  { id: "profile", label: "Profile", href: "/supervisor/settings", icon: "User" },
];

export const supervisorNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/supervisor/dashboard", icon: "LayoutDashboard" },
  { id: "students", label: "Students", href: "/supervisor/students", icon: "GraduationCap" },
  { id: "reports", label: "Reports", href: "/supervisor/reviews", icon: "FileText" },
  { id: "broadcast", label: "Broadcast", href: "/supervisor/broadcast", icon: "Megaphone" },
  { id: "companies", label: "Company Directory", href: "/supervisor/companies", icon: "Building2" },
];

export const adminTopNavItems: NavItem[] = [
  { id: "placements", label: "Placements", href: "/admin/supervisor-student-directory", icon: "Briefcase" },
  { id: "logbook", label: "Logbook", href: "/admin/reports", icon: "BookOpen" },
  { id: "profile", label: "Profile", href: "/admin/settings", icon: "User" },
];

export const adminNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  {
    id: "student-allocation",
    label: "Student Allocation",
    href: "/admin/student-allocation",
    icon: "UserCheck",
  },
  {
    id: "supervisor-student-directory",
    label: "Supervisor Student Directory",
    href: "/admin/supervisor-student-directory",
    icon: "FolderTree",
  },
  { id: "broadcast", label: "Broadcast", href: "/admin/broadcast", icon: "Megaphone" },
  { id: "supervisors", label: "Supervisors", href: "/admin/supervisors", icon: "Users" },
  { id: "companies", label: "Company Directory", href: "/admin/companies", icon: "Building2" },
  { id: "internships", label: "Internships", href: "/admin/internships", icon: "Briefcase" },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: "BarChart3" },
];

export const roleLabels = {
  student: "Student",
  supervisor: "Supervisor",
  admin: "Administrator",
} as const;

export const roleDashboardPaths = {
  student: "/student/dashboard",
  supervisor: "/supervisor/dashboard",
  admin: "/admin/dashboard",
} as const;
~~~

### `lib/notify.ts`

~~~ts
import { addToast } from "@heroui/react";

export function notifySuccess(message: string, title = "Success") {
  addToast({ title, description: message, color: "success", timeout: 4000 });
}

export function notifyError(message: string, title = "Error") {
  addToast({ title, description: message, color: "danger", timeout: 5000 });
}

export function notifyInfo(message: string, title = "Notice") {
  addToast({ title, description: message, color: "primary", timeout: 4000 });
}
~~~

### `lib/session.ts`

~~~ts
const SESSION_KEY = "itp_user";
const TOKEN_KEY = "authToken";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "supervisor" | "admin";
  // student
  studentId?: string;
  supervisorId?: string;
  department?: string;
  departmentCode?: string;
  program?: string;
  year?: number;
  gpa?: number;
  batch?: string;
  phone?: string;
  internshipStatus?: string;
  internshipCompany?: string;
  internshipRole?: string;
  cvFileName?: string;
  // supervisor
  title?: string;
  assignedStudents?: number;
  // admin
  permissions?: string[];
};

export function saveSession(user: SessionUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
}

/** Maps a raw DB row (snake_case) to a SessionUser (camelCase). */
export function mapDbUser(db: Record<string, unknown>): SessionUser {
  return {
    id: db.id as string,
    name: db.name as string,
    email: db.email as string,
    role: db.role as SessionUser["role"],
    studentId: (db.student_id ?? undefined) as string | undefined,
    supervisorId: (db.supervisor_id ?? undefined) as string | undefined,
    department: ((db.department ?? db.department_code) ?? undefined) as string | undefined,
    departmentCode: (db.department_code ?? undefined) as string | undefined,
    program: (db.program ?? undefined) as string | undefined,
    year: (db.year ?? undefined) as number | undefined,
    gpa: (db.gpa ?? undefined) as number | undefined,
    batch: (db.batch ?? undefined) as string | undefined,
    phone: (db.phone ?? undefined) as string | undefined,
    internshipStatus: (db.internship_status ?? undefined) as string | undefined,
    internshipCompany: (db.internship_company ?? undefined) as string | undefined,
    internshipRole: (db.internship_role ?? undefined) as string | undefined,
    cvFileName: (db.cv_file_name ?? undefined) as string | undefined,
    title: (db.title ?? undefined) as string | undefined,
    assignedStudents: (db.assigned_students ?? undefined) as number | undefined,
    permissions: (db.permissions ?? undefined) as string[] | undefined,
  };
}
~~~

### `lib/settings.ts`

~~~ts
import { systemSettings } from "@/data/mock";
import type { SystemSetting } from "@/types";

const ACADEMIC_YEAR_ID = "set-003";
const INTERNSHIP_DURATION_ID = "set-004";

export const adminSettings: SystemSetting[] = systemSettings.filter(
  (s) => s.id !== ACADEMIC_YEAR_ID
);

export const supervisorSettings: SystemSetting[] = systemSettings.filter(
  (s) => s.id === INTERNSHIP_DURATION_ID
);
~~~

### `lib/store/app-store.tsx`

~~~tsx
"use client";

import {
  companies as initialCompanies,
  currentAdmin,
  currentStudent,
  currentSupervisor,
  monthlyReports,
  notifications as initialNotifications,
  students as initialStudents,
  supervisors as initialSupervisors,
} from "@/data/mock";
import { initialAnnouncements } from "@/lib/store/initial-announcements";
import { getSession, saveSession, type SessionUser } from "@/lib/session";
import type {
  Announcement,
  AnnouncementAuthorRole,
  AnnouncementPriority,
  AnnouncementTarget,
  AppNotification,
  Company,
  LogbookReport,
  LogbookReportStatus,
  NotificationCategory,
  Student,
  Supervisor,
} from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

function periodToMonthKey(period: string): string {
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const parts = period.trim().toLowerCase().split(/\s+/);
  if (parts.length >= 2) {
    const mon = months[parts[0].slice(0, 3)] ?? "01";
    const year = parts[1].length === 2 ? `20${parts[1]}` : parts[1];
    return `${year}-${mon}`;
  }
  return period;
}

function migrateMonthlyReports(): LogbookReport[] {
  return monthlyReports.map((r) => {
    const status: LogbookReportStatus =
      r.status === "reviewed"
        ? "accepted"
        : (r.status as LogbookReportStatus) === "pending"
          ? "pending"
          : "pending";
    return {
      id: r.id,
      studentId: r.studentId,
      studentName: currentStudent.name,
      supervisorId: currentStudent.supervisorId ?? "sup-001",
      monthNumber: r.monthNumber,
      period: r.period,
      monthKey: periodToMonthKey(r.period),
      submittedAt: "2024-10-15T09:00:00",
      status,
      excerpt: r.excerpt,
      feedback: r.feedback,
      marks: r.rating != null ? r.rating * 20 : undefined,
      isCurrent: r.isCurrent,
      pdfFileName: status !== "pending" ? `report-${r.period.replace(/\s/g, "-")}.pdf` : undefined,
      pdfUrl:
        status !== "pending"
          ? "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf"
          : undefined,
    };
  });
}

function buildInitialNotifications(): AppNotification[] {
  const migrated = initialNotifications.map((n, i) => ({
    ...n,
    audience: (i === 2 ? "supervisor" : "student") as AppNotification["audience"],
    userId: i === 2 ? currentSupervisor.id : currentStudent.id,
    category: "general" as NotificationCategory,
  }));
  return [
    ...migrated,
    {
      id: "not-deadline-001",
      audience: "student" as const,
      userId: currentStudent.id,
      title: "Upcoming Report Deadline",
      message: "Your next monthly logbook report is due in 5 days.",
      read: false,
      createdAt: new Date().toISOString(),
      type: "warning" as const,
      category: "deadline" as NotificationCategory,
    },
    {
      id: "not-intern-001",
      audience: "student" as const,
      userId: currentStudent.id,
      title: "Internship Deadline",
      message: "Software Engineering Intern application deadline: Jun 30, 2025.",
      read: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      type: "info" as const,
      category: "internship" as NotificationCategory,
    },
  ];
}

function deriveAllocationStatus(supervisorId?: string): Student["allocationStatus"] {
  return supervisorId ? "allocated" : "unassigned";
}

function initStudents(raw: Student[]): Student[] {
  return raw.map((s) => ({
    ...s,
    allocationStatus: deriveAllocationStatus(s.supervisorId),
    ...(s.id === currentStudent.id
      ? {
          cvFileName: "alex-morgan-cv.pdf",
          internshipCompany: "TechNova Solutions",
          internshipRole: "Software Engineering Intern",
        }
      : {}),
  }));
}

interface AppStoreValue {
  companies: Company[];
  students: Student[];
  supervisors: Supervisor[];
  announcements: Announcement[];
  logbookReports: LogbookReport[];
  notifications: AppNotification[];
  addCompany: (company: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  removeCompany: (id: string) => void;
  addSupervisor: (supervisor: Supervisor) => void;
  updateSupervisor: (id: string, patch: Partial<Supervisor>) => void;
  removeSupervisor: (id: string) => void;
  removeStudent: (id: string) => void;
  getApprovedCompanies: () => Company[];
  submitLogbookReport: (input: {
    id?: string;
    studentId: string;
    period: string;
    excerpt: string;
    pdfUrl: string;
    pdfFileName: string;
  }) => LogbookReport;
  reviewLogbookReport: (input: {
    reportId: string;
    status: "accepted" | "rejected";
    marks: number;
    feedback: string;
  }) => void;
  deleteLogbookReport: (reportId: string) => void;
  updateStudentRecord: (
    studentId: string,
    patch: Partial<Student>,
    changeType: string
  ) => void;
  addStudent: (student: Student) => void;
  getStudentById: (id: string) => Student | undefined;
  getReportsForStudent: (studentId: string) => LogbookReport[];
  getReportsForSupervisor: (supervisorId: string) => LogbookReport[];
  getNotificationsFor: (audience: AppNotification["audience"], userId?: string) => AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (audience: AppNotification["audience"], userId?: string) => void;
  allocateStudents: (studentIds: string[], supervisorId: string | null) => void;
  getSupervisorById: (id: string) => Supervisor | undefined;
  getStudentsBySupervisor: (supervisorId: string) => Student[];
  getAssignedSupervisorForStudent: (studentId: string) => Supervisor | undefined;
  publishAnnouncement: (input: {
    title: string;
    message: string;
    priority: AnnouncementPriority;
    target: AnnouncementTarget;
    authorId: string;
    authorName: string;
    authorRole: AnnouncementAuthorRole;
    supervisorId?: string;
    linkUrl?: string;
    attachmentName?: string;
    scheduledAt?: string;
    category?: Announcement["category"];
  }) => Announcement;
  getPublishedAnnouncementsForStudent: (studentId: string) => Announcement[];
  getAllAnnouncements: () => Announcement[];
  adminProfile: { name: string; email: string; phone: string; title: string };
  updateAdminProfile: (patch: Partial<{ name: string; email: string; phone: string; title: string }>) => void;
  currentUser: SessionUser | null;
  updateCurrentUser: (patch: Partial<SessionUser>) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [students, setStudents] = useState<Student[]>(() => initStudents(initialStudents));
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [adminProfile, setAdminProfile] = useState({
    name: currentAdmin.name,
    email: currentAdmin.email,
    phone: "",
    title: "Faculty Administrator",
  });

  const updateAdminProfile = useCallback(
    (patch: Partial<{ name: string; email: string; phone: string; title: string }>) =>
      setAdminProfile((prev) => ({ ...prev, ...patch })),
    []
  );

  const [currentUser, setCurrentUser] = useState<SessionUser | null>(() => getSession());

  const updateCurrentUser = useCallback((patch: Partial<SessionUser>) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      saveSession(next);
      return next;
    });
  }, []);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [logbookReports, setLogbookReports] = useState<LogbookReport[]>(migrateMonthlyReports);
  const [notifications, setNotifications] = useState<AppNotification[]>(buildInitialNotifications);

  const pushNotification = useCallback((n: Omit<AppNotification, "id" | "read" | "createdAt">) => {
    const entry: AppNotification = {
      ...n,
      id: `not-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [entry, ...prev]);
  }, []);

  const notifyStudentById = useCallback(
    (
      studentId: string,
      title: string,
      message: string,
      category: NotificationCategory,
      type: AppNotification["type"] = "info"
    ) => {
      pushNotification({
        audience: "student",
        userId: studentId,
        title,
        message,
        type,
        category,
      });
    },
    [pushNotification]
  );

  const notifyStudent = useCallback(
    (
      title: string,
      message: string,
      category: NotificationCategory,
      type: AppNotification["type"] = "info",
      studentId: string = currentStudent.id
    ) => {
      notifyStudentById(studentId, title, message, category, type);
    },
    [notifyStudentById]
  );

  const notifyAdmin = useCallback(
    (title: string, message: string, category: NotificationCategory, type: AppNotification["type"] = "info") => {
      pushNotification({
        audience: "admin",
        userId: currentAdmin.id,
        title,
        message,
        type,
        category,
      });
    },
    [pushNotification]
  );

  const broadcastCompanyChange = useCallback(
    (action: string, companyName: string) => {
      notifyStudent(
        "Company Directory Updated",
        `Administrator ${action} company "${companyName}" in the directory.`,
        "company",
        "info"
      );
      pushNotification({
        audience: "supervisor",
        userId: currentSupervisor.id,
        title: "Company Directory Updated",
        message: `Company "${companyName}" was ${action} by administration.`,
        type: "info",
        category: "company",
      });
    },
    [notifyStudent, pushNotification]
  );

  const addCompany = useCallback(
    (company: Omit<Company, "id" | "createdAt">) => {
      const entry: Company = {
        ...company,
        id: `com-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCompanies((prev) => [...prev, entry]);
      broadcastCompanyChange("added", entry.name);
    },
    [broadcastCompanyChange]
  );

  const updateCompany = useCallback(
    (id: string, patch: Partial<Company>) => {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
      );
      const name = patch.name ?? companies.find((c) => c.id === id)?.name ?? "Company";
      broadcastCompanyChange("updated", name);
    },
    [broadcastCompanyChange, companies]
  );

  const removeCompany = useCallback(
    (id: string) => {
      const name = companies.find((c) => c.id === id)?.name ?? "Company";
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      broadcastCompanyChange("removed", name);
    },
    [broadcastCompanyChange, companies]
  );

  const getApprovedCompanies = useCallback(
    () => companies.filter((c) => c.status === "approved"),
    [companies]
  );

  const addSupervisor = useCallback(
    (supervisor: Supervisor) => setSupervisors((prev) => [...prev, supervisor]),
    []
  );

  const updateSupervisor = useCallback(
    (id: string, patch: Partial<Supervisor>) =>
      setSupervisors((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    []
  );

  const removeSupervisor = useCallback(
    (id: string) => setSupervisors((prev) => prev.filter((s) => s.id !== id)),
    []
  );

  const removeStudent = useCallback(
    (id: string) => setStudents((prev) => prev.filter((s) => s.id !== id)),
    []
  );

  const submitLogbookReport = useCallback(
    (input: { id?: string; studentId: string; period: string; excerpt: string; pdfUrl: string; pdfFileName: string }) => {
      const student = students.find((s) => s.id === input.studentId) ?? currentStudent;
      const nextNum =
        Math.max(
          ...logbookReports.filter((r) => r.studentId === input.studentId).map((r) => r.monthNumber),
          0
        ) + 1;

      const entry: LogbookReport = {
        id: input.id ?? `mr-${Date.now()}`,
        studentId: input.studentId,
        studentName: student.name,
        supervisorId: student.supervisorId ?? "sup-001",
        monthNumber: nextNum,
        period: input.period.trim(),
        monthKey: periodToMonthKey(input.period),
        submittedAt: new Date().toISOString(),
        status: "pending",
        excerpt: input.excerpt.trim(),
        pdfUrl: input.pdfUrl,
        pdfFileName: input.pdfFileName,
        isCurrent: true,
      };

      setLogbookReports((prev) => [
        ...prev.map((r) =>
          r.studentId === input.studentId ? { ...r, isCurrent: false } : r
        ),
        entry,
      ]);

      notifyStudent(
        "Report Submitted Successfully",
        `Your monthly report for ${entry.period} has been submitted and is awaiting supervisor review.`,
        "report_submitted",
        "success"
      );

      pushNotification({
        audience: "supervisor",
        userId: entry.supervisorId,
        title: "New Logbook Submission",
        message: `${student.name} submitted the ${entry.period} report (PDF).`,
        type: "warning",
        category: "report_submitted",
      });

      return entry;
    },
    [logbookReports, notifyStudent, pushNotification, students]
  );

  const reviewLogbookReport = useCallback(
    (input: { reportId: string; status: "accepted" | "rejected"; marks: number; feedback: string }) => {
      setLogbookReports((prev) =>
        prev.map((r) =>
          r.id === input.reportId
            ? {
                ...r,
                status: input.status,
                marks: input.marks,
                feedback: input.feedback,
                reviewedAt: new Date().toISOString(),
              }
            : r
        )
      );

      const report = logbookReports.find((r) => r.id === input.reportId);
      if (!report) return;

      const isAccepted = input.status === "accepted";
      const sid = report.studentId;
      notifyStudent(
        isAccepted ? "Report Accepted" : "Report Rejected",
        `Your ${report.period} report has been ${input.status}. Marks: ${input.marks}. ${input.feedback ? "See supervisor comments in your logbook." : ""}`,
        isAccepted ? "report_accepted" : "report_rejected",
        isAccepted ? "success" : "error",
        sid
      );

      if (input.feedback) {
        notifyStudent("Supervisor Feedback", input.feedback, "report_feedback", "info", sid);
      }

      notifyStudent(
        "Report Review Completed",
        `Supervisor reviewed your ${report.period} submission on ${new Date().toLocaleString()}.`,
        "report_reviewed",
        "info",
        sid
      );
    },
    [logbookReports, notifyStudent]
  );

  const addStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      if (prev.some((s) => s.studentId === student.studentId)) return prev;
      return [...prev, { ...student, allocationStatus: deriveAllocationStatus(student.supervisorId) }];
    });
  }, []);

  const updateStudentRecord = useCallback(
    (studentId: string, patch: Partial<Student>, changeType: string) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, ...patch } : s))
      );
      // Persist to DB â€” fire-and-forget, silent on mock IDs
      const apiPatch: Record<string, unknown> = {};
      if (patch.name !== undefined) apiPatch.name = patch.name;
      if (patch.email !== undefined) apiPatch.email = patch.email;
      if (patch.phone !== undefined) apiPatch.phone = patch.phone;
      if (patch.department !== undefined) apiPatch.department = patch.department;
      if (patch.program !== undefined) apiPatch.program = patch.program;
      if (patch.year !== undefined) apiPatch.year = patch.year;
      if (patch.gpa !== undefined) apiPatch.gpa = patch.gpa;
      if (patch.internshipStatus !== undefined) apiPatch.internship_status = patch.internshipStatus;
      if (patch.internshipCompany !== undefined) apiPatch.internship_company = patch.internshipCompany;
      if (patch.internshipRole !== undefined) apiPatch.internship_role = patch.internshipRole;
      if (patch.supervisorId !== undefined) apiPatch.supervisor_id = patch.supervisorId;
      if (patch.allocationStatus !== undefined) apiPatch.allocation_status = patch.allocationStatus;
      if (Object.keys(apiPatch).length > 0) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/users/${studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiPatch),
        }).catch(() => {});
      }
      const student = students.find((s) => s.id === studentId);
      const name = student?.name ?? "Student";
      const when = new Date().toLocaleString();
      notifyAdmin(
        "Student Profile Updated",
        `${name} updated ${changeType} on ${when}.`,
        "profile",
        "warning"
      );
    },
    [notifyAdmin, students]
  );

  const getStudentById = useCallback(
    (id: string) => students.find((s) => s.id === id),
    [students]
  );

  const deleteLogbookReport = useCallback(
    (reportId: string) => {
      setLogbookReports((prev) => prev.filter((r) => r.id !== reportId));
    },
    []
  );

  const getReportsForStudent = useCallback(
    (studentId: string) =>
      [...logbookReports]
        .filter((r) => r.studentId === studentId)
        .sort((a, b) => b.monthNumber - a.monthNumber),
    [logbookReports]
  );

  const getReportsForSupervisor = useCallback(
    (supervisorId: string) =>
      [...logbookReports]
        .filter((r) => r.supervisorId === supervisorId)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    [logbookReports]
  );

  const getNotificationsFor = useCallback(
    (audience: AppNotification["audience"], userId?: string) =>
      notifications
        .filter(
          (n) =>
            n.audience === audience &&
            (!userId || !n.userId || n.userId === userId)
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(
    (audience: AppNotification["audience"], userId?: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.audience === audience && (!userId || !n.userId || n.userId === userId)
            ? { ...n, read: true }
            : n
        )
      );
    },
    []
  );

  const recalcSupervisorCounts = useCallback((list: Student[]) => {
    setSupervisors((prev) =>
      prev.map((sup) => ({
        ...sup,
        assignedStudents: list.filter((s) => s.supervisorId === sup.id).length,
      }))
    );
  }, []);

  const allocateStudents = useCallback(
    (studentIds: string[], supervisorId: string | null) => {
      const supervisor = supervisorId
        ? supervisors.find((s) => s.id === supervisorId)
        : undefined;

      setStudents((prev) => {
        const next = prev.map((s) => {
          if (!studentIds.includes(s.id)) return s;
          return {
            ...s,
            supervisorId: supervisorId ?? undefined,
            allocationStatus: deriveAllocationStatus(supervisorId ?? undefined),
          };
        });
        recalcSupervisorCounts(next);
        return next;
      });

      setLogbookReports((prev) =>
        prev.map((r) =>
          studentIds.includes(r.studentId) && supervisorId
            ? { ...r, supervisorId }
            : r
        )
      );

      const label = supervisor?.name ?? "Unassigned";
      studentIds.forEach((id) => {
        const st = students.find((s) => s.id === id);
        notifyStudentById(
          id,
          supervisorId ? "Supervisor Assigned" : "Supervisor Assignment Removed",
          supervisorId
            ? `You have been allocated to ${label}.`
            : "Your supervisor assignment has been removed by administration.",
          "allocation",
          supervisorId ? "success" : "warning"
        );
      });

      if (supervisorId) {
        pushNotification({
          audience: "supervisor",
          userId: supervisorId,
          title: "Students Allocated",
          message: `${studentIds.length} student(s) assigned to you by administration.`,
          type: "info",
          category: "allocation",
        });
      }

      notifyAdmin(
        "Allocation Updated",
        `${studentIds.length} student(s) ${supervisorId ? `assigned to ${label}` : "unassigned"}.`,
        "allocation",
        "info"
      );
    },
    [
      supervisors,
      students,
      recalcSupervisorCounts,
      notifyStudentById,
      pushNotification,
      notifyAdmin,
    ]
  );

  const getSupervisorById = useCallback(
    (id: string) => supervisors.find((s) => s.id === id),
    [supervisors]
  );

  const getStudentsBySupervisor = useCallback(
    (supervisorId: string) => students.filter((s) => s.supervisorId === supervisorId),
    [students]
  );

  const getAssignedSupervisorForStudent = useCallback(
    (studentId: string) => {
      const st = students.find((s) => s.id === studentId);
      if (!st?.supervisorId) return undefined;
      return supervisors.find((s) => s.id === st.supervisorId);
    },
    [students, supervisors]
  );

  const getTargetStudentIds = useCallback(
    (target: AnnouncementTarget, supervisorId?: string) => {
      if (target === "all_students") return students.map((s) => s.id);
      if (!supervisorId) return [];
      return students.filter((s) => s.supervisorId === supervisorId).map((s) => s.id);
    },
    [students]
  );

  const publishAnnouncement = useCallback(
    (input: {
      title: string;
      message: string;
      priority: AnnouncementPriority;
      target: AnnouncementTarget;
      authorId: string;
      authorName: string;
      authorRole: AnnouncementAuthorRole;
      supervisorId?: string;
      linkUrl?: string;
      attachmentName?: string;
      scheduledAt?: string;
      category?: Announcement["category"];
    }) => {
      const now = new Date();
      const scheduled = input.scheduledAt ? new Date(input.scheduledAt) : null;
      const isScheduledFuture = scheduled && scheduled > now;

      const entry: Announcement = {
        id: `ann-${Date.now()}`,
        title: input.title.trim(),
        message: input.message.trim(),
        authorId: input.authorId,
        authorName: input.authorName,
        authorRole: input.authorRole,
        priority: input.priority,
        target: input.target,
        supervisorId: input.supervisorId,
        linkUrl: input.linkUrl,
        attachmentName: input.attachmentName,
        scheduledAt: input.scheduledAt,
        publishedAt: isScheduledFuture ? undefined : now.toISOString(),
        createdAt: now.toISOString(),
        category: input.category ?? "general",
      };

      setAnnouncements((prev) => [entry, ...prev]);

      if (!isScheduledFuture) {
        const targetIds = getTargetStudentIds(input.target, input.supervisorId);
        targetIds.forEach((studentId) => {
          notifyStudentById(
            studentId,
            `New Announcement: ${entry.title}`,
            entry.message.slice(0, 120) + (entry.message.length > 120 ? "â€¦" : ""),
            "announcement",
            entry.priority === "urgent" ? "warning" : "info"
          );
        });
      }

      return entry;
    },
    [getTargetStudentIds, notifyStudentById]
  );

  const isAnnouncementVisibleToStudent = useCallback(
    (a: Announcement, student: Student) => {
      const now = new Date();
      if (a.scheduledAt && new Date(a.scheduledAt) > now) return false;
      if (!a.publishedAt && a.scheduledAt) return false;
      if (a.target === "all_students") return true;
      return (
        a.target === "supervisor_students" &&
        !!a.supervisorId &&
        student.supervisorId === a.supervisorId
      );
    },
    []
  );

  const getPublishedAnnouncementsForStudent = useCallback(
    (studentId: string) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return [];
      return announcements
        .filter((a) => isAnnouncementVisibleToStudent(a, student))
        .filter((a) => a.publishedAt || !a.scheduledAt || new Date(a.scheduledAt) <= new Date())
        .sort(
          (a, b) =>
            new Date(b.publishedAt ?? b.createdAt).getTime() -
            new Date(a.publishedAt ?? a.createdAt).getTime()
        );
    },
    [announcements, students, isAnnouncementVisibleToStudent]
  );

  const getAllAnnouncements = useCallback(
    () =>
      [...announcements].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [announcements]
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      companies,
      students,
      supervisors,
      announcements,
      logbookReports,
      notifications,
      addCompany,
      updateCompany,
      removeCompany,
      addSupervisor,
      updateSupervisor,
      removeSupervisor,
      removeStudent,
      getApprovedCompanies,
      submitLogbookReport,
      reviewLogbookReport,
      deleteLogbookReport,
      updateStudentRecord,
      addStudent,
      getStudentById,
      getReportsForStudent,
      getReportsForSupervisor,
      getNotificationsFor,
      markNotificationRead,
      markAllNotificationsRead,
      allocateStudents,
      getSupervisorById,
      getStudentsBySupervisor,
      getAssignedSupervisorForStudent,
      publishAnnouncement,
      getPublishedAnnouncementsForStudent,
      getAllAnnouncements,
      adminProfile,
      updateAdminProfile,
      currentUser,
      updateCurrentUser,
    }),
    [
      companies,
      students,
      supervisors,
      announcements,
      logbookReports,
      notifications,
      addCompany,
      updateCompany,
      removeCompany,
      addSupervisor,
      updateSupervisor,
      removeSupervisor,
      removeStudent,
      getApprovedCompanies,
      submitLogbookReport,
      reviewLogbookReport,
      deleteLogbookReport,
      updateStudentRecord,
      addStudent,
      getStudentById,
      getReportsForStudent,
      getReportsForSupervisor,
      getNotificationsFor,
      markNotificationRead,
      markAllNotificationsRead,
      allocateStudents,
      getSupervisorById,
      getStudentsBySupervisor,
      getAssignedSupervisorForStudent,
      publishAnnouncement,
      getPublishedAnnouncementsForStudent,
      getAllAnnouncements,
      adminProfile,
      updateAdminProfile,
      currentUser,
      updateCurrentUser,
    ]
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
~~~

### `lib/store/initial-announcements.ts`

~~~ts
import { currentAdmin, currentSupervisor, studentPortalDashboard } from "@/data/mock";
import type { Announcement } from "@/types";

const workshop = studentPortalDashboard.workshop;

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-workshop-001",
    title: workshop.title,
    message: workshop.description,
    authorId: currentAdmin.id,
    authorName: currentAdmin.name,
    authorRole: "admin",
    priority: "important",
    target: "all_students",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: "workshop",
    linkUrl: "/student/announcements",
  },
  {
    id: "ann-001",
    title: "Internship Orientation Session",
    message:
      "All students starting placements this term must attend the orientation on Friday at 2:00 PM in Hall B.",
    authorId: currentAdmin.id,
    authorName: "Faculty Administration",
    authorRole: "admin",
    priority: "urgent",
    target: "all_students",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: "internship",
  },
  {
    id: "ann-002",
    title: "Logbook Submission Reminder",
    message:
      "Please ensure your monthly logbook PDF is submitted before the end of this week.",
    authorId: currentSupervisor.id,
    authorName: currentSupervisor.name,
    authorRole: "supervisor",
    priority: "important",
    target: "supervisor_students",
    supervisorId: currentSupervisor.id,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    category: "reminder",
  },
];
~~~

### `lib/supabase.ts`

~~~ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_KEY in environment variables");
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : ({} as any);
~~~

### `lib/utils.ts`

~~~ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formFieldClassNames = {
  inputWrapper: "border-border bg-surface-card shadow-none rounded-input",
  input: "text-text-primary placeholder:text-text-secondary",
  label: "text-text-primary",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): "success" | "warning" | "danger" | "default" | "primary" {
  const map: Record<string, "success" | "warning" | "danger" | "default" | "primary"> = {
    approved: "success",
    open: "success",
    active: "success",
    not_placed: "danger",
    pending: "warning",
    reviewing: "warning",
    draft: "default",
    rejected: "danger",
    closed: "danger",
    withdrawn: "default",
  };
  return map[status] ?? "default";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
~~~

### `next.config.ts`

~~~ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
~~~

### `package.json`

~~~json
{
  "name": "intern-industrial-training",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "node ./node_modules/next/dist/bin/next dev",
    "build": "node ./node_modules/next/dist/bin/next build",
    "start": "node ./node_modules/next/dist/bin/next start",
    "lint": "node ./node_modules/next/dist/bin/next lint"
  },
  "dependencies": {
    "@heroui/react": "^2.7.5",
    "@heroui/theme": "^2.4.5",
    "@supabase/supabase-js": "^2.107.0",
    "@tailwindcss/postcss": "^4.3.0",
    "clsx": "^2.1.1",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "framer-motion": "^12.6.3",
    "lucide-react": "^0.487.0",
    "next": "^15.2.4",
    "next-themes": "^0.4.6",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwind-merge": "^3.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.24.0",
    "eslint-config-next": "^15.2.4",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.3.0",
    "typescript": "^5.8.3"
  }
}
~~~

### `postcss.config.mjs`

~~~js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;
~~~

### `README.md`

~~~md
<<<<<<< HEAD
# Intern & Industrial Training System (Frontend)

A frontend-only Next.js 15 application for managing internships, applications, and industrial training progress.

## Tech Stack

- Next.js 15 (App Router)
- HeroUI
- Tailwind CSS
- TypeScript
- Lucide Icons
- next-themes (dark/light mode)

## Getting Started

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Login (Mock)

Use the login page and select a role (Student, Supervisor, or Admin). Any credentials work â€” you'll be redirected to the matching dashboard.

## Routes

### Authentication
- `/login`
- `/register`
- `/forgot-password`

### Student
- `/student/dashboard`
- `/student/profile`
- `/student/cv`
- `/student/applications`
- `/student/internships`

### Supervisor
- `/supervisor/dashboard`
- `/supervisor/students`
- `/supervisor/reviews`
- `/supervisor/reports`

### Admin
- `/admin/dashboard`
- `/admin/supervisor-student-directory`
- `/admin/supervisors`
- `/admin/companies`
- `/admin/internships`
- `/admin/reports`
- `/admin/settings`

## Project Structure

```
app/           # Next.js App Router pages
components/    # Reusable UI components
data/          # Mock JSON data
lib/           # Utilities and navigation config
types/         # TypeScript types
public/        # Static assets
```

## Notes

- Frontend only â€” no backend or API
- All data is mocked in `data/mock.ts`
- Match Figma spacing/colors using Dev Mode and update `tailwind.config.ts` as needed

## Windows Path Note

If your project folder contains `&` in the name, npm scripts use direct `node` paths to avoid Windows shell issues.
=======
# Intern-Industrial-Training-Portal
The Intern and Industrial Training System is a web-based platform that connects university students with companies offering internships and training opportunities. Students can create profiles, upload CVs, and apply for vacancies, while companies can post opportunities, search candidates, and manage recruitment through a centralized system.
>>>>>>> dfd6de926376bf1fdb6ffc82b0d673cc361b0829
~~~

### `tailwind.config.ts`

~~~ts
import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FFF9F5",
          sidebar: "#FFFFFF",
          card: "#FFFFFF",
          muted: "#F4EDE6",
        },
        text: {
          primary: "#3D2E26",
          secondary: "#7A6B62",
        },
        border: {
          DEFAULT: "#DDD0C5",
        },
        brand: {
          50: "#FDF5EF",
          100: "#FAE8DB",
          200: "#F4D0B5",
          300: "#E8AD82",
          400: "#D9824A",
          500: "#B35A1F",
          600: "#9A4C18",
          700: "#7D3E14",
          800: "#5C2E10",
          900: "#3D2E26",
          950: "#261C16",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        input: "12px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [
    heroui({
      layout: {
        radius: {
          small: "8px",
          medium: "12px",
          large: "16px",
        },
      },
      themes: {
        light: {
          colors: {
            background: "#FFF9F5",
            foreground: "#3D2E26",
            content1: "#FFFFFF",
            content2: "#FFF9F5",
            content3: "#F4EDE6",
            content4: "#EBE2DA",
            divider: "#DDD0C5",
            focus: "#B35A1F",
            default: {
              50: "#FAF7F5",
              100: "#F4EEE9",
              200: "#EDE4DC",
              300: "#DDD0C5",
              400: "#A89890",
              500: "#7A6B62",
              600: "#5C4F48",
              700: "#4A3F38",
              800: "#3D2E26",
              900: "#2A1F19",
              DEFAULT: "#DDD0C5",
              foreground: "#3D2E26",
            },
            primary: {
              50: "#FDF5EF",
              100: "#FAE8DB",
              200: "#F4D0B5",
              300: "#E8AD82",
              400: "#D9824A",
              500: "#B35A1F",
              600: "#9A4C18",
              700: "#7D3E14",
              800: "#5C2E10",
              900: "#3D2E26",
              DEFAULT: "#B35A1F",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FF9800",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            background: "#1A1410",
            foreground: "#F4EEE9",
            content1: "#261C16",
            content2: "#2A1F19",
            content3: "#3D2E26",
            content4: "#4A3F38",
            divider: "#5C4F48",
            focus: "#D9824A",
            default: {
              50: "#1A1410",
              100: "#261C16",
              200: "#2A1F19",
              300: "#3D2E26",
              400: "#5C4F48",
              500: "#7A6B62",
              600: "#A89890",
              700: "#DDD0C5",
              800: "#F0E8E2",
              900: "#FAF7F5",
              DEFAULT: "#5C4F48",
              foreground: "#F4EEE9",
            },
            primary: {
              DEFAULT: "#D9824A",
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FF9800",
              foreground: "#FFFFFF",
            },
            danger: {
              DEFAULT: "#EF4444",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};

export default config;
~~~

### `tsconfig.json`

~~~json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
~~~

### `types/index.ts`

~~~ts
export type UserRole = "student" | "supervisor" | "admin";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected"
  | "withdrawn";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type InternshipPlacementStatus = "active" | "pending" | "not_placed";

export type DepartmentCategory = "CMIS" | "IMGT" | "MATH & STAT" | "ELTN";

/** Logbook report lifecycle */
export type LogbookReportStatus =
  | "pending"
  | "unreviewed"
  | "reviewed"
  | "accepted"
  | "rejected";

export type NotificationAudience = "student" | "admin" | "supervisor";

export type NotificationCategory =
  | "report_submitted"
  | "report_reviewed"
  | "report_accepted"
  | "report_rejected"
  | "report_feedback"
  | "deadline"
  | "internship"
  | "profile"
  | "announcement"
  | "allocation"
  | "company"
  | "general";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
}

export type AllocationStatus = "allocated" | "unassigned" | "pending";

export interface Student extends User {
  role: "student";
  studentId: string;
  program: string;
  year: number;
  gpa?: number;
  cvUrl?: string;
  cvFileName?: string;
  supervisorId?: string;
  allocationStatus?: AllocationStatus;
  departmentCode?: string;
  batch?: string;
  internshipStatus?: InternshipPlacementStatus;
  internshipCompany?: string;
  internshipRole?: string;
}

export interface Supervisor extends User {
  role: "supervisor";
  title: string;
  assignedStudents: number;
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  email: string;
  phone: string;
  website?: string;
  status: "pending" | "approved" | "rejected";
  logo?: string;
  description: string;
  companyLetter?: string;
  createdAt: string;
}

export interface Internship {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  duration: string;
  deadline: string;
  description: string;
  requirements: string[];
  slots: number;
  applied: number;
  status: "open" | "closed" | "draft";
  stipend?: string;
  departmentCategory?: DepartmentCategory;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  coverLetter?: string;
}

export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  supervisorId: string;
  title: string;
  type: "weekly" | "midterm" | "final";
  submittedAt: string;
  status: ReviewStatus;
  content: string;
  feedback?: string;
  score?: number;
}

export interface LogbookReport {
  id: string;
  studentId: string;
  studentName: string;
  supervisorId: string;
  monthNumber: number;
  period: string;
  monthKey: string;
  submittedAt: string;
  status: LogbookReportStatus;
  excerpt: string;
  pdfUrl?: string;
  pdfFileName?: string;
  feedback?: string;
  marks?: number;
  reviewedAt?: string;
  isCurrent?: boolean;
}

/** @deprecated Use LogbookReport */
export type MonthlyReportStatus = LogbookReportStatus;

/** @deprecated Use LogbookReport */
export interface MonthlyReport extends Omit<LogbookReport, "studentName" | "supervisorId" | "monthKey" | "submittedAt"> {
  rating?: number;
}

export interface ProgressReport {
  id: string;
  studentId: string;
  studentName: string;
  week: number;
  submittedAt: string;
  status: ReviewStatus;
  summary: string;
  achievements: string[];
  challenges: string[];
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}

export interface NavItem {
  id?: string;
  label: string;
  href: string;
  icon: string;
}

export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  userId?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "info" | "success" | "warning" | "error";
  category: NotificationCategory;
}

/** @deprecated Use AppNotification */
export type Notification = AppNotification;

export type AnnouncementPriority = "normal" | "important" | "urgent";
export type AnnouncementTarget = "all_students" | "supervisor_students";
export type AnnouncementAuthorRole = "admin" | "supervisor";
export type AnnouncementCategory = "workshop" | "general" | "internship" | "deadline" | "reminder";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  authorId: string;
  authorName: string;
  authorRole: AnnouncementAuthorRole;
  priority: AnnouncementPriority;
  target: AnnouncementTarget;
  supervisorId?: string;
  linkUrl?: string;
  attachmentName?: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  category: AnnouncementCategory;
}

export interface SystemSetting {
  id: string;
  label: string;
  description: string;
  value: string | boolean | number;
  type: "text" | "boolean" | "number" | "select";
  options?: string[];
}
~~~


