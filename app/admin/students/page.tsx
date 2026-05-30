"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { SearchBar } from "@/components/ui/search-bar";
import { students, supervisors } from "@/data/mock";
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

const PAGE_SIZE = 8;

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const supervisorMap = Object.fromEntries(supervisors.map((s) => [s.id, s.name]));

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q)
    );
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Students"
        description={`${students.length} students registered in the system`}
        action={
          <Button color="primary" radius="lg">
            Add Student
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search students..."
          />
        </div>

        <Table aria-label="Students table" removeWrapper>
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>ID</TableColumn>
            <TableColumn>PROGRAM</TableColumn>
            <TableColumn>YEAR</TableColumn>
            <TableColumn>SUPERVISOR</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {paginated.map((student) => (
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
                <TableCell>{student.program}</TableCell>
                <TableCell>Year {student.year}</TableCell>
                <TableCell>
                  {student.supervisorId ? supervisorMap[student.supervisorId] ?? "—" : "—"}
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

        <PaginationBar
          page={page}
          total={totalPages}
          onChange={setPage}
          className="mt-6 flex justify-center"
        />
      </ContentCard>
    </div>
  );
}
