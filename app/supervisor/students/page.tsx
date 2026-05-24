"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { SearchBar } from "@/components/ui/search-bar";
import { currentSupervisor, students } from "@/data/mock";
import { getInitials } from "@/lib/utils";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 8;

export default function SupervisorStudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const assignedStudents = students.filter((s) => s.supervisorId === currentSupervisor.id);

  const filtered = useMemo(() => {
    if (!search) return assignedStudents;
    const q = search.toLowerCase();
    return assignedStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.program.toLowerCase().includes(q)
    );
  }, [assignedStudents, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Students"
        description={`Managing ${assignedStudents.length} students under your supervision`}
      />

      <ContentCard>
        <div className="mb-6">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by name, ID, or program..."
          />
        </div>

        <Table aria-label="Assigned students" removeWrapper>
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>STUDENT ID</TableColumn>
            <TableColumn>PROGRAM</TableColumn>
            <TableColumn>YEAR</TableColumn>
            <TableColumn>GPA</TableColumn>
            <TableColumn>EMAIL</TableColumn>
          </TableHeader>
          <TableBody>
            {paginated.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={getInitials(student.name)} size="sm" color="primary" />
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>Year {student.year}</TableCell>
                <TableCell>{student.gpa ?? "—"}</TableCell>
                <TableCell className="text-default-500">{student.email}</TableCell>
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
