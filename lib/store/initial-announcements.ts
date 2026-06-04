import { currentAdmin, currentSupervisor, studentPortalDashboard } from "@/data/mock";
import type { Announcement } from "@/types";

const workshop = studentPortalDashboard.workshop;

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-workshop-001",
    title: workshop.title,
    message: workshop.description,
    authorId: currentAdmin.id,
    authorName: currentAdmin.name,
    authorRole: "admin",
    priority: "important",
    target: "all_students",
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: "workshop",
    linkUrl: "/student/announcements",
  },
  {
    id: "ann-001",
    title: "Internship Orientation Session",
    message:
      "All students starting placements this term must attend the orientation on Friday at 2:00 PM in Hall B.",
    authorId: currentAdmin.id,
    authorName: "Faculty Administration",
    authorRole: "admin",
    priority: "urgent",
    target: "all_students",
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: "internship",
  },
  {
    id: "ann-002",
    title: "Logbook Submission Reminder",
    message:
      "Please ensure your monthly logbook PDF is submitted before the end of this week.",
    authorId: currentSupervisor.id,
    authorName: currentSupervisor.name,
    authorRole: "supervisor",
    priority: "important",
    target: "supervisor_students",
    supervisorId: currentSupervisor.id,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    category: "reminder",
  },
];
