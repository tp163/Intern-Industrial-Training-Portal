"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { supervisors } from "@/data/mock";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import { notifyError, notifySuccess } from "@/lib/notify";
import type { Supervisor } from "@/types";
import {
  Avatar,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Eye, Pencil, Plus, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";

export default function AdminSupervisorsPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(supervisors);
  const [selected, setSelected] = useState<Supervisor | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    department: "",
    phone: "",
  });

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openAdd = () => {
    setForm({ name: "", email: "", title: "", department: "", phone: "" });
    setShowAdd(true);
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) {
      notifyError("Name and email are required.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newSup: Supervisor = {
        id: `sup-${Date.now()}`,
        name: form.name,
        email: form.email,
        role: "supervisor",
        title: form.title,
        department: form.department,
        phone: form.phone,
        assignedStudents: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setItems((prev) => [...prev, newSup]);
      setSaving(false);
      setShowAdd(false);
      notifySuccess("Supervisor added successfully.");
    }, 700);
  };

  const closeDetail = () => {
    setSelected(null);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor Management"
        description={`${items.length} supervisors in the system`}
        action={
          <Button color="primary" radius="lg" startContent={<Plus size={16} />} onPress={openAdd}>
            Add Supervisor
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search supervisors..." />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<UserCheck size={28} />}
            title="No supervisors found"
            description="Try a different search or add a new supervisor."
          />
        ) : (
        <TableScroll>
        <Table aria-label="Supervisors table" removeWrapper>
          <TableHeader>
            <TableColumn>SUPERVISOR</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>DEPARTMENT</TableColumn>
            <TableColumn>STUDENTS</TableColumn>
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
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      aria-label="View"
                      onPress={() => {
                        setSelected(supervisor);
                        setEditMode(false);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      aria-label="Edit"
                      onPress={() => {
                        setSelected(supervisor);
                        setForm({
                          name: supervisor.name,
                          email: supervisor.email,
                          title: supervisor.title,
                          department: supervisor.department ?? "",
                          phone: supervisor.phone ?? "",
                        });
                        setEditMode(true);
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableScroll>
        )}
      </ContentCard>

      <AppModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Supervisor"
        footer={
          <>
            <Button variant="light" onPress={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button color="primary" isLoading={saving} onPress={handleAdd}>
              Create Supervisor
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" value={form.name} onValueChange={(v) => setForm((f) => ({ ...f, name: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Email" value={form.email} onValueChange={(v) => setForm((f) => ({ ...f, email: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Title" value={form.title} onValueChange={(v) => setForm((f) => ({ ...f, title: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Department" value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
          <Input label="Phone" value={form.phone} onValueChange={(v) => setForm((f) => ({ ...f, phone: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
        </div>
      </AppModal>

      <AppModal
        isOpen={!!selected}
        onClose={closeDetail}
        title={editMode ? "Edit Supervisor" : "Supervisor Details"}
        footer={
          editMode ? (
            <>
              <Button variant="light" onPress={closeDetail}>Cancel</Button>
              <Button color="primary" isLoading={saving} onPress={() => {
                setSaving(true);
                setTimeout(() => {
                  if (selected) {
                    setItems((prev) =>
                      prev.map((s) =>
                        s.id === selected.id
                          ? { ...s, ...form, title: form.title }
                          : s
                      )
                    );
                  }
                  setSaving(false);
                  notifySuccess("Supervisor updated.");
                  closeDetail();
                }, 600);
              }}>Save</Button>
            </>
          ) : (
            <Button variant="light" onPress={closeDetail}>Close</Button>
          )
        }
      >
        {selected && (
          <div className="grid gap-4 sm:grid-cols-2">
            {editMode ? (
              <>
                <Input label="Name" value={form.name} onValueChange={(v) => setForm((f) => ({ ...f, name: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
                <Input label="Email" value={form.email} onValueChange={(v) => setForm((f) => ({ ...f, email: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
                <Input label="Title" value={form.title} onValueChange={(v) => setForm((f) => ({ ...f, title: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
                <Input label="Department" value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))} variant="bordered" radius="lg" classNames={formFieldClassNames} />
              </>
            ) : (
              <>
                <p><span className="text-text-secondary">Name:</span> {selected.name}</p>
                <p><span className="text-text-secondary">Email:</span> {selected.email}</p>
                <p><span className="text-text-secondary">Title:</span> {selected.title}</p>
                <p><span className="text-text-secondary">Department:</span> {selected.department ?? "—"}</p>
                <p><span className="text-text-secondary">Students:</span> {selected.assignedStudents}</p>
              </>
            )}
          </div>
        )}
      </AppModal>
    </div>
  );
}
