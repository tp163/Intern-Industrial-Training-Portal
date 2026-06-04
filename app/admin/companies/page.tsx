"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { companies, internships } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import type { Company } from "@/types";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Briefcase, Building2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("");
  const [viewCompany, setViewCompany] = useState<Company | null>(null);

  const filtered = useMemo(() => {
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        (c.companyLetter?.toLowerCase().includes(q) ?? false)
    );
  }, [search]);

  const companyInternships = useMemo(() => {
    if (!viewCompany) return [];
    return internships.filter((i) => i.companyId === viewCompany.id);
  }, [viewCompany]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Directory"
        description="Partner companies and memorandum of understanding records"
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
            <TableColumn>INTERNSHIPS</TableColumn>
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
    </div>
  );
}
