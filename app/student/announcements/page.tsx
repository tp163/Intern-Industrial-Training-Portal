"use client";

import { AnnouncementCard } from "@/components/announcements/announcement-card";
import { useAppStore } from "@/lib/store/app-store";
import { authFetch } from "@/lib/auth-fetch";
import type { Announcement, AnnouncementAuthorRole, AnnouncementPriority, AnnouncementTarget } from "@/types";
import { Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function mapAnnouncement(row: Record<string, unknown>): Announcement {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    message: String(row.message ?? ""),
    authorId: String(row.author_id ?? row.authorId ?? ""),
    authorName: String(row.author_name ?? row.authorName ?? ""),
    authorRole: (row.author_role as AnnouncementAuthorRole) ?? (row.authorRole as AnnouncementAuthorRole) ?? "admin",
    priority: (row.priority as AnnouncementPriority) ?? "normal",
    target: (row.target as AnnouncementTarget) ?? "all_students",
    supervisorId: row.supervisor_id || row.supervisorId ? String(row.supervisor_id ?? row.supervisorId) : undefined,
    studentId: row.student_id || row.studentId ? String(row.student_id ?? row.studentId) : undefined,
    studentIds: row.student_ids || row.studentIds ? (Array.isArray(row.student_ids ?? row.studentIds) ? (row.student_ids ?? row.studentIds) as string[] : []) : undefined,
    isPersonal: Boolean(row.is_personal ?? row.isPersonal),
    linkUrl: row.link_url || row.linkUrl ? String(row.link_url ?? row.linkUrl) : undefined,
    attachmentName: row.attachment_name || row.attachmentName ? String(row.attachment_name ?? row.attachmentName) : undefined,
    attachmentUrl: row.attachment_url || row.attachmentUrl ? String(row.attachment_url ?? row.attachmentUrl) : undefined,
    scheduledAt: row.scheduled_at || row.scheduledAt ? String(row.scheduled_at ?? row.scheduledAt) : undefined,
    publishedAt: row.published_at || row.publishedAt ? String(row.published_at ?? row.publishedAt) : undefined,
    createdAt: String(row.created_at ?? row.createdAt ?? ""),
    category: (row.category as Announcement["category"]) ?? "general",
  };
}

export default function StudentAnnouncementsPage() {
  const { announcements, currentUser, getStudentById, loadRealData } = useAppStore();
  const [supabaseAnnouncements, setSupabaseAnnouncements] = useState<Announcement[]>([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const student = currentUser?.id ? getStudentById(currentUser.id) : undefined;
  const supervisorId = student?.supervisorId;
  const announcementRows = supabaseAnnouncements.length > 0 ? supabaseAnnouncements : announcements;
  const visibleAnnouncements = useMemo(() => {
    const now = new Date();
    return announcementRows
      .filter((announcement) => {
        if (announcement.scheduledAt && new Date(announcement.scheduledAt) > now) return false;
        if (announcement.target === "all_students") return true;
        if (announcement.target === "single_student") return announcement.studentId === currentUser?.id;
        if (announcement.target === "specific_students") return announcement.studentIds?.includes(currentUser?.id ?? "") ?? false;
        return (
          announcement.target === "supervisor_students" &&
          !!supervisorId &&
          announcement.supervisorId === supervisorId
        );
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt ?? b.createdAt).getTime() -
          new Date(a.publishedAt ?? a.createdAt).getTime()
      );
  }, [announcementRows, supervisorId, currentUser?.id]);

  useEffect(() => {
    loadRealData();
  }, [loadRealData, currentUser?.id]);

  useEffect(() => {
    let mounted = true;
    async function loadAnnouncementsFromBackend() {
      try {
        const response = await authFetch(`${API_BASE}/announcements`);
        const result = await response.json();
        if (!response.ok || !result.success) return;
        if (mounted) {
          setSupabaseAnnouncements((result.data ?? []).map(mapAnnouncement));
        }
      } catch { /* silent — falls back to store data */ }
    }
    loadAnnouncementsFromBackend();
    const timer = setInterval(loadAnnouncementsFromBackend, 30_000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const filtered = useMemo(() => {
    return visibleAnnouncements.filter((a) => {
      const matchesPriority = priorityFilter === "all" || a.priority === priorityFilter;
      const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
      return matchesPriority && matchesCategory;
    });
  }, [visibleAnnouncements, priorityFilter, categoryFilter]);

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
          <p className="mt-1 text-sm text-text-secondary">
            Check back later for updates. Scheduled broadcasts appear here on their scheduled date.
          </p>
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
