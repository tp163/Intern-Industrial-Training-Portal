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
