"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { internships } from "@/data/mock";
import { capitalize, formatDate } from "@/lib/utils";
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
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "draft", label: "Draft" },
];

export default function AdminInternshipsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return internships.filter((i) => {
      const matchesSearch =
        !search ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.companyName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Internships"
        description={`${internships.length} internship listings`}
        action={
          <Button color="primary" radius="lg">
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

        <Table aria-label="Internships table" removeWrapper>
          <TableHeader>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>COMPANY</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>SLOTS</TableColumn>
            <TableColumn>DEADLINE</TableColumn>
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
                <TableCell>{capitalize(internship.type)}</TableCell>
                <TableCell>
                  {internship.applied}/{internship.slots}
                </TableCell>
                <TableCell>{formatDate(internship.deadline)}</TableCell>
                <TableCell>
                  <StatusBadge status={internship.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button isIconOnly size="sm" variant="light" aria-label="Edit">
                      <Pencil size={16} />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Delete">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentCard>
    </div>
  );
}
