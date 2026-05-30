"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { companies } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import type { Company } from "@/types";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminCompaniesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState(companies);

  const filtered = useMemo(() => {
    return items.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const updateStatus = (id: string, status: Company["status"]) => {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Companies"
        description="Review and approve company registrations"
      />

      <ContentCard>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search companies..."
            className="flex-1"
          />
          <Select
            className="w-full sm:w-48"
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

        <Table aria-label="Companies table" removeWrapper>
          <TableHeader>
            <TableColumn>COMPANY</TableColumn>
            <TableColumn>INDUSTRY</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn>REGISTERED</TableColumn>
            <TableColumn>STATUS</TableColumn>
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
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell>{formatDate(company.createdAt)}</TableCell>
                <TableCell>
                  <StatusBadge status={company.status} />
                </TableCell>
                <TableCell>
                  {company.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        radius="lg"
                        startContent={<Check size={14} />}
                        onPress={() => updateStatus(company.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        radius="lg"
                        startContent={<X size={14} />}
                        onPress={() => updateStatus(company.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-text-secondary">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentCard>
    </div>
  );
}
