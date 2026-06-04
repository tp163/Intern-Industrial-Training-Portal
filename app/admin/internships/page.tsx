"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, EmptyState, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { TableScroll } from "@/components/ui/table-scroll";
import { StatusBadge } from "@/components/ui/status-badge";
import { internships as initialInternships } from "@/data/mock";
import { notifyError, notifySuccess } from "@/lib/notify";
import { capitalize, formatDate, formFieldClassNames } from "@/lib/utils";
import type { Internship } from "@/types";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { key: "all", label: "All Statuses" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "draft", label: "Draft" },
];

const emptyPostForm = {
  title: "",
  companyName: "",
  location: "",
  duration: "3 months",
  slots: "1",
  type: "onsite" as Internship["type"],
};

export default function AdminInternshipsPage() {
  const [items, setItems] = useState(initialInternships);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPost, setShowPost] = useState(false);
  const [postForm, setPostForm] = useState(emptyPostForm);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        !search ||
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.companyName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handlePost = () => {
    if (!postForm.title.trim() || !postForm.companyName.trim()) {
      notifyError("Title and company name are required.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const entry: Internship = {
        id: `int-${Date.now()}`,
        companyId: "co-new",
        companyName: postForm.companyName,
        title: postForm.title,
        description: "New internship listing.",
        location: postForm.location || "TBD",
        type: postForm.type,
        duration: postForm.duration,
        slots: Number(postForm.slots) || 1,
        applied: 0,
        deadline: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
        status: "open",
        requirements: ["CV required"],
      };
      setItems((prev) => [entry, ...prev]);
      setSaving(false);
      setShowPost(false);
      setPostForm(emptyPostForm);
      notifySuccess("Internship posted successfully.");
    }, 700);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    notifySuccess("Internship listing removed.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Internships"
        description={`${items.length} internship listings`}
        action={
          <Button
            color="primary"
            radius="lg"
            startContent={<Plus size={16} />}
            onPress={() => setShowPost(true)}
          >
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

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No internships found"
            description="Adjust filters or post a new internship."
          />
        ) : (
          <TableScroll>
            <Table aria-label="Internships table" removeWrapper>
              <TableHeader>
                <TableColumn>TITLE</TableColumn>
                <TableColumn>COMPANY</TableColumn>
                <TableColumn className="hidden sm:table-cell">TYPE</TableColumn>
                <TableColumn>SLOTS</TableColumn>
                <TableColumn className="hidden md:table-cell">DEADLINE</TableColumn>
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
                    <TableCell className="hidden sm:table-cell">
                      {capitalize(internship.type)}
                    </TableCell>
                    <TableCell>
                      {internship.applied}/{internship.slots}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(internship.deadline)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={internship.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          aria-label="Edit"
                          onPress={() => notifySuccess("Edit form opened (demo).")}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label="Delete"
                          onPress={() => handleDelete(internship.id)}
                        >
                          <Trash2 size={16} />
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
        isOpen={showPost}
        onClose={() => setShowPost(false)}
        title="Post Internship"
        footer={
          <>
            <Button variant="light" onPress={() => setShowPost(false)}>
              Cancel
            </Button>
            <Button color="primary" isLoading={saving} onPress={handlePost}>
              Publish
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Job Title"
            value={postForm.title}
            onValueChange={(v) => setPostForm((f) => ({ ...f, title: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
            className="sm:col-span-2"
          />
          <Input
            label="Company"
            value={postForm.companyName}
            onValueChange={(v) => setPostForm((f) => ({ ...f, companyName: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
          <Input
            label="Location"
            value={postForm.location}
            onValueChange={(v) => setPostForm((f) => ({ ...f, location: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
          <Input
            label="Duration"
            value={postForm.duration}
            onValueChange={(v) => setPostForm((f) => ({ ...f, duration: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
          <Input
            label="Slots"
            type="number"
            min={1}
            value={postForm.slots}
            onValueChange={(v) => setPostForm((f) => ({ ...f, slots: v }))}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
        </div>
      </AppModal>
    </div>
  );
}
