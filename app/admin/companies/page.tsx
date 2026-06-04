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
import { Briefcase, Building2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const emptyForm = {
  name: "",
  industry: "",
  location: "",
  email: "",
  phone: "",
  description: "",
  companyLetter: "",
  status: "approved" as Company["status"],
};

export default function AdminCompaniesPage() {
  const { companies, addCompany, removeCompany } = useAppStore();
  const [search, setSearch] = useState("");
  const [viewCompany, setViewCompany] = useState<Company | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);

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
    addCompany({ ...form, website: undefined, logo: undefined });
    notifySuccess("Company added. Student and supervisor directories updated.");
    setShowAdd(false);
    setForm(emptyForm);
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
                  <span className="font-mono text-sm font-medium text-primary">
                    {company.companyLetter ?? "—"}
                  </span>
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
          <Input label="Company Letter" value={form.companyLetter} onValueChange={(v) => setForm((f) => ({ ...f, companyLetter: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
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
