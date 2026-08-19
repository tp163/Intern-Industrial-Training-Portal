"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { useAppStore } from "@/lib/store/app-store";
import { apiUploadFile } from "@/lib/api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate, formFieldClassNames } from "@/lib/utils";
import type { Company } from "@/types";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Briefcase, Building2, FileText, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const emptyForm = {
  name: "",
  industry: "",
  location: "",
  email: "",
  phone: "",
  description: "",
};

export default function AdminCompaniesPage() {
  const { companies, internships, addCompany, updateCompany, removeCompany, loadRealData } = useAppStore();
  const [search, setSearch] = useState("");
  const [viewCompany, setViewCompany] = useState<Company | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
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

  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    try {
      let companyLetterUrl: string | null = null;
      if (letterFile) {
        const uploaded = await apiUploadFile(letterFile);
        companyLetterUrl = uploaded.url;
      }
      const payload = {
        name: form.name,
        industry: form.industry,
        location: form.location,
        email: form.email,
        phone: form.phone,
        description: form.description,
        company_letter: companyLetterUrl ?? editingCompany?.companyLetter ?? null,
        status: "approved",
      };
      const response = await authFetch(
        editingCompany ? `${API_BASE}/companies/${editingCompany.id}` : `${API_BASE}/companies`,
        {
        method: editingCompany ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || (editingCompany ? "Failed to update company" : "Failed to add company"));
      if (editingCompany) {
        updateCompany(editingCompany.id, {
          ...form,
          companyLetter: companyLetterUrl ?? editingCompany.companyLetter,
        });
      } else {
        addCompany({
          ...form,
          website: undefined,
          logo: undefined,
          companyLetter: companyLetterUrl ?? undefined,
          status: "approved",
        });
      }
      // Replace the optimistic client id with the database-generated UUID. This
      // is required when the admin posts an internship immediately afterwards.
      await loadRealData();
      notifySuccess(editingCompany ? "Company details updated." : "Company added. Student and supervisor directories updated.");
      setShowAdd(false);
      setEditingCompany(null);
      setForm(emptyForm);
      setLetterFile(null);
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to add company.");
    } finally {
      setAdding(false);
    }
  };

  const openEdit = (company: Company) => {
    setEditingCompany(company);
    setForm({
      name: company.name,
      industry: company.industry,
      location: company.location,
      email: company.email,
      phone: company.phone,
      description: company.description,
    });
    setLetterFile(null);
    setShowAdd(true);
  };

  const closeCompanyForm = () => {
    setShowAdd(false);
    setEditingCompany(null);
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
        description="Manage the central company directory — changes sync to student and supervisor portals"
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
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      startContent={<FileText size={14} />}
                      isDisabled={!company.companyLetter.startsWith("http")}
                      onPress={() => window.open(company.companyLetter, "_blank", "noopener,noreferrer")}
                    >
                      View Letter
                    </Button>
                  ) : (
                    <span className="text-sm text-text-secondary">—</span>
                  )}
                </TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    aria-label="Edit company"
                    onPress={() => openEdit(company)}
                  >
                    <Pencil size={16} />
                  </Button>
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
                    onPress={async () => {
                      try {
                        const res = await authFetch(`${API_BASE}/companies/${company.id}`, { method: "DELETE" });
                        const result = await res.json();
                        if (!res.ok || !result.success) throw new Error(result.message || "Failed to remove company");
                        removeCompany(company.id);
                        notifySuccess("Company removed from directory.");
                      } catch (err) {
                        notifyError(err instanceof Error ? err.message : "Failed to remove company.");
                      }
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
        title={viewCompany ? `Internships — ${viewCompany.name}` : "Internships"}
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
                  {job.location} · {job.duration} · {job.status}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Deadline: {formatDate(job.deadline)} · {job.applied}/{job.slots} applied
                </p>
              </li>
            ))}
          </ul>
        )}
      </AppModal>

      <AppModal
        isOpen={showAdd}
        onClose={closeCompanyForm}
        title={editingCompany ? "Edit Company" : "Add Company"}
        footer={
          <>
            <Button variant="light" onPress={closeCompanyForm}>Cancel</Button>
            <Button color="primary" isLoading={adding} onPress={handleAdd}>{editingCompany ? "Save Changes" : "Add Company"}</Button>
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
          <Input label="Description" value={form.description} onValueChange={(v) => setForm((f) => ({ ...f, description: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
        </div>
      </AppModal>
    </div>
  );
}
