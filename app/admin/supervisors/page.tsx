"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { supervisors } from "@/data/mock";
import { getInitials } from "@/lib/utils";
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
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminSupervisorsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return supervisors;
    const q = search.toLowerCase();
    return supervisors.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Supervisors"
        description={`${supervisors.length} supervisors in the system`}
        action={
          <Button color="primary" radius="lg">
            Add Supervisor
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search supervisors..."
          />
        </div>

        <Table aria-label="Supervisors table" removeWrapper>
          <TableHeader>
            <TableColumn>SUPERVISOR</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>DEPARTMENT</TableColumn>
            <TableColumn>STUDENTS</TableColumn>
            <TableColumn>PHONE</TableColumn>
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
                <TableCell>{supervisor.department ?? "—"}</TableCell>
                <TableCell>{supervisor.assignedStudents}</TableCell>
                <TableCell>{supervisor.phone ?? "—"}</TableCell>
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
