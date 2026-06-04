"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { currentStudent } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { Select, SelectItem } from "@heroui/react";
import { useMemo, useState } from "react";

export default function StudentAnnouncementsPage() {
  const { getPublishedAnnouncementsForStudent } = useAppStore();
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const announcements = getPublishedAnnouncementsForStudent(currentStudent.id);

  const filtered = useMemo(() => {
    return announcements.filter((a) => {
      const matchesPriority = priorityFilter === "all" || a.priority === priorityFilter;
      const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
      return matchesPriority && matchesCategory;
    });
  }, [announcements, priorityFilter, categoryFilter]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="ds-page-title">Announcements</h1>
        <p className="ds-page-description">
          All updates from administrators and your supervisor, including workshops and deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label="Priority"
          selectedKeys={[priorityFilter]}
          onSelectionChange={(keys) => setPriorityFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
        >
          <SelectItem key="all">All Priorities</SelectItem>
          <SelectItem key="normal">Normal</SelectItem>
          <SelectItem key="important">Important</SelectItem>
          <SelectItem key="urgent">Urgent</SelectItem>
        </Select>
        <Select
          label="Category"
          selectedKeys={[categoryFilter]}
          onSelectionChange={(keys) => setCategoryFilter((Array.from(keys)[0] as string) ?? "all")}
          variant="bordered"
          radius="lg"
        >
          <SelectItem key="all">All Categories</SelectItem>
          <SelectItem key="workshop">Workshop</SelectItem>
          <SelectItem key="general">General</SelectItem>
          <SelectItem key="internship">Internship</SelectItem>
          <SelectItem key="deadline">Deadline</SelectItem>
          <SelectItem key="reminder">Reminder</SelectItem>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No announcements</p>
          <p className="mt-1 text-sm text-text-secondary">Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}
