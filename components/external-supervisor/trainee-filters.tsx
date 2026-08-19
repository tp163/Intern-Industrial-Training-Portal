"use client";

import { Input, Select, SelectItem } from "@heroui/react";
import type { Student } from "@/types";

interface TraineeFiltersProps {
  students: Student[];
  search: string;
  department: string;
  batch: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onBatchChange: (value: string) => void;
}

export function filterTrainees(students: Student[], search: string, department: string, batch: string) {
  const normalizedSearch = search.trim().toLowerCase();
  return students.filter((student) => {
    const matchesSearch = !normalizedSearch
      || student.name.toLowerCase().includes(normalizedSearch)
      || student.studentId.toLowerCase().includes(normalizedSearch);
    const matchesDepartment = department === "all" || student.departmentCode === department;
    const matchesBatch = batch === "all" || student.batch === batch;
    return matchesSearch && matchesDepartment && matchesBatch;
  });
}

export function TraineeFilters({
  students,
  search,
  department,
  batch,
  onSearchChange,
  onDepartmentChange,
  onBatchChange,
}: TraineeFiltersProps) {
  const departments = Array.from(new Set(students.map((student) => student.departmentCode).filter((value): value is string => Boolean(value)))).sort();
  const batches = Array.from(new Set(students.map((student) => student.batch).filter((value): value is string => Boolean(value)))).sort();
  const departmentOptions = [{ key: "all", label: "All departments" }, ...departments.map((value) => ({ key: value, label: value }))];
  const batchOptions = [{ key: "all", label: "All batches" }, ...batches.map((value) => ({ key: value, label: value }))];

  return <div className="grid gap-3 sm:grid-cols-3">
    <Input label="Search trainees" placeholder="Name or student ID" value={search} onValueChange={onSearchChange} />
    <Select label="Department" items={departmentOptions} selectedKeys={[department]} onSelectionChange={(keys) => onDepartmentChange(String(Array.from(keys)[0] ?? "all"))}>
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
    <Select label="Batch" items={batchOptions} selectedKeys={[batch]} onSelectionChange={(keys) => onBatchChange(String(Array.from(keys)[0] ?? "all"))}>
      {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
    </Select>
  </div>;
}
