"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { getInitials } from "@/lib/utils";
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
import { UserCheck } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminStudentAllocationPage() {
  const { students, supervisors, allocateStudents } = useAppStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetSupervisor, setTargetSupervisor] = useState("");
  const [allocating, setAllocating] = useState(false);

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
    if (selected.size === 0) {
      notifyError("Select at least one student.");
      return;
    }
    if (!targetSupervisor) {
      notifyError("Select a supervisor to assign.");
      return;
    }
    setAllocating(true);
    setTimeout(() => {
      allocateStudents(Array.from(selected), targetSupervisor);
      setAllocating(false);
      setSelected(new Set());
      notifySuccess(`${selected.size} student(s) allocated successfully.`);
    }, 500);
  };

  const handleUnassign = () => {
    if (selected.size === 0) {
      notifyError("Select at least one student.");
      return;
    }
    setAllocating(true);
    setTimeout(() => {
      allocateStudents(Array.from(selected), null);
      setAllocating(false);
      setSelected(new Set());
      notifySuccess("Supervisor assignment removed for selected students.");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Allocation"
        description="Assign or reassign students to supervisors. Changes sync instantly across all portals."
      />

      <ContentCard>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search students..."
            className="flex-1"
          />
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
              color="primary"
              radius="lg"
              startContent={<UserCheck size={16} />}
              isLoading={allocating}
              isDisabled={selected.size === 0}
              onPress={handleAllocate}
            >
              Allocate ({selected.size})
            </Button>
            <Button
              variant="bordered"
              radius="lg"
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
              if (keys === "all") {
                setSelected(new Set(filtered.map((s) => s.id)));
              } else {
                setSelected(new Set(Array.from(keys) as string[]));
              }
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
                  <TableCell className="hidden md:table-cell">
                    {student.departmentCode ?? "—"}
                  </TableCell>
                  <TableCell>
                    {student.supervisorId
                      ? supervisorMap[student.supervisorId] ?? "—"
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={student.supervisorId ? "success" : "warning"}
                    >
                      {student.allocationStatus ?? (student.supervisorId ? "allocated" : "unassigned")}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </ContentCard>
    </div>
  );
}
