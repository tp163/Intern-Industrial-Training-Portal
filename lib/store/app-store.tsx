"use client";

import {
  companies as initialCompanies,
  currentAdmin,
  currentStudent,
  currentSupervisor,
  monthlyReports,
  notifications as initialNotifications,
  students as initialStudents,
  supervisors as initialSupervisors,
} from "@/data/mock";
import { initialAnnouncements } from "@/lib/store/initial-announcements";
import type {
  Announcement,
  AnnouncementAuthorRole,
  AnnouncementPriority,
  AnnouncementTarget,
  AppNotification,
  Company,
  LogbookReport,
  LogbookReportStatus,
  NotificationCategory,
  Student,
  Supervisor,
} from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

function periodToMonthKey(period: string): string {
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const parts = period.trim().toLowerCase().split(/\s+/);
  if (parts.length >= 2) {
    const mon = months[parts[0].slice(0, 3)] ?? "01";
    const year = parts[1].length === 2 ? `20${parts[1]}` : parts[1];
    return `${year}-${mon}`;
  }
  return period;
}

function migrateMonthlyReports(): LogbookReport[] {
  return monthlyReports.map((r) => {
    const status: LogbookReportStatus =
      r.status === "reviewed"
        ? "accepted"
        : (r.status as LogbookReportStatus) === "pending"
          ? "pending"
          : "pending";
    return {
      id: r.id,
      studentId: r.studentId,
      studentName: currentStudent.name,
      supervisorId: currentStudent.supervisorId ?? "sup-001",
      monthNumber: r.monthNumber,
      period: r.period,
      monthKey: periodToMonthKey(r.period),
      submittedAt: "2024-10-15T09:00:00",
      status,
      excerpt: r.excerpt,
      feedback: r.feedback,
      marks: r.rating != null ? r.rating * 20 : undefined,
      isCurrent: r.isCurrent,
      pdfFileName: status !== "pending" ? `report-${r.period.replace(/\s/g, "-")}.pdf` : undefined,
      pdfUrl:
        status !== "pending"
          ? "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf"
          : undefined,
    };
  });
}

function buildInitialNotifications(): AppNotification[] {
  const migrated = initialNotifications.map((n, i) => ({
    ...n,
    audience: (i === 2 ? "supervisor" : "student") as AppNotification["audience"],
    userId: i === 2 ? currentSupervisor.id : currentStudent.id,
    category: "general" as NotificationCategory,
  }));
  return [
    ...migrated,
    {
      id: "not-deadline-001",
      audience: "student" as const,
      userId: currentStudent.id,
      title: "Upcoming Report Deadline",
      message: "Your next monthly logbook report is due in 5 days.",
      read: false,
      createdAt: new Date().toISOString(),
      type: "warning" as const,
      category: "deadline" as NotificationCategory,
    },
    {
      id: "not-intern-001",
      audience: "student" as const,
      userId: currentStudent.id,
      title: "Internship Deadline",
      message: "Software Engineering Intern application deadline: Jun 30, 2025.",
      read: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      type: "info" as const,
      category: "internship" as NotificationCategory,
    },
  ];
}

function deriveAllocationStatus(supervisorId?: string): Student["allocationStatus"] {
  return supervisorId ? "allocated" : "unassigned";
}

function initStudents(raw: Student[]): Student[] {
  return raw.map((s) => ({
    ...s,
    allocationStatus: deriveAllocationStatus(s.supervisorId),
    ...(s.id === currentStudent.id
      ? {
          cvFileName: "alex-morgan-cv.pdf",
          internshipCompany: "TechNova Solutions",
          internshipRole: "Software Engineering Intern",
        }
      : {}),
  }));
}

interface AppStoreValue {
  companies: Company[];
  students: Student[];
  supervisors: Supervisor[];
  announcements: Announcement[];
  logbookReports: LogbookReport[];
  notifications: AppNotification[];
  addCompany: (company: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  removeCompany: (id: string) => void;
  getApprovedCompanies: () => Company[];
  submitLogbookReport: (input: {
    studentId: string;
    period: string;
    excerpt: string;
    pdfFile: File;
  }) => LogbookReport;
  reviewLogbookReport: (input: {
    reportId: string;
    status: "accepted" | "rejected";
    marks: number;
    feedback: string;
  }) => void;
  updateStudentRecord: (
    studentId: string,
    patch: Partial<Student>,
    changeType: string
  ) => void;
  addStudent: (student: Student) => void;
  getStudentById: (id: string) => Student | undefined;
  getReportsForStudent: (studentId: string) => LogbookReport[];
  getReportsForSupervisor: (supervisorId: string) => LogbookReport[];
  getNotificationsFor: (audience: AppNotification["audience"], userId?: string) => AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (audience: AppNotification["audience"], userId?: string) => void;
  allocateStudents: (studentIds: string[], supervisorId: string | null) => void;
  getSupervisorById: (id: string) => Supervisor | undefined;
  getStudentsBySupervisor: (supervisorId: string) => Student[];
  getAssignedSupervisorForStudent: (studentId: string) => Supervisor | undefined;
  publishAnnouncement: (input: {
    title: string;
    message: string;
    priority: AnnouncementPriority;
    target: AnnouncementTarget;
    authorId: string;
    authorName: string;
    authorRole: AnnouncementAuthorRole;
    supervisorId?: string;
    linkUrl?: string;
    attachmentName?: string;
    scheduledAt?: string;
    category?: Announcement["category"];
  }) => Announcement;
  getPublishedAnnouncementsForStudent: (studentId: string) => Announcement[];
  getAllAnnouncements: () => Announcement[];
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [students, setStudents] = useState<Student[]>(() => initStudents(initialStudents));
  const [supervisors, setSupervisors] = useState<Supervisor[]>(initialSupervisors);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [logbookReports, setLogbookReports] = useState<LogbookReport[]>(migrateMonthlyReports);
  const [notifications, setNotifications] = useState<AppNotification[]>(buildInitialNotifications);

  const pushNotification = useCallback((n: Omit<AppNotification, "id" | "read" | "createdAt">) => {
    const entry: AppNotification = {
      ...n,
      id: `not-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [entry, ...prev]);
  }, []);

  const notifyStudentById = useCallback(
    (
      studentId: string,
      title: string,
      message: string,
      category: NotificationCategory,
      type: AppNotification["type"] = "info"
    ) => {
      pushNotification({
        audience: "student",
        userId: studentId,
        title,
        message,
        type,
        category,
      });
    },
    [pushNotification]
  );

  const notifyStudent = useCallback(
    (
      title: string,
      message: string,
      category: NotificationCategory,
      type: AppNotification["type"] = "info",
      studentId: string = currentStudent.id
    ) => {
      notifyStudentById(studentId, title, message, category, type);
    },
    [notifyStudentById]
  );

  const notifyAdmin = useCallback(
    (title: string, message: string, category: NotificationCategory, type: AppNotification["type"] = "info") => {
      pushNotification({
        audience: "admin",
        userId: currentAdmin.id,
        title,
        message,
        type,
        category,
      });
    },
    [pushNotification]
  );

  const broadcastCompanyChange = useCallback(
    (action: string, companyName: string) => {
      notifyStudent(
        "Company Directory Updated",
        `Administrator ${action} company "${companyName}" in the directory.`,
        "company",
        "info"
      );
      pushNotification({
        audience: "supervisor",
        userId: currentSupervisor.id,
        title: "Company Directory Updated",
        message: `Company "${companyName}" was ${action} by administration.`,
        type: "info",
        category: "company",
      });
    },
    [notifyStudent, pushNotification]
  );

  const addCompany = useCallback(
    (company: Omit<Company, "id" | "createdAt">) => {
      const entry: Company = {
        ...company,
        id: `com-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCompanies((prev) => [...prev, entry]);
      broadcastCompanyChange("added", entry.name);
    },
    [broadcastCompanyChange]
  );

  const updateCompany = useCallback(
    (id: string, patch: Partial<Company>) => {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
      );
      const name = patch.name ?? companies.find((c) => c.id === id)?.name ?? "Company";
      broadcastCompanyChange("updated", name);
    },
    [broadcastCompanyChange, companies]
  );

  const removeCompany = useCallback(
    (id: string) => {
      const name = companies.find((c) => c.id === id)?.name ?? "Company";
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      broadcastCompanyChange("removed", name);
    },
    [broadcastCompanyChange, companies]
  );

  const getApprovedCompanies = useCallback(
    () => companies.filter((c) => c.status === "approved"),
    [companies]
  );

  const submitLogbookReport = useCallback(
    (input: { studentId: string; period: string; excerpt: string; pdfFile: File }) => {
      const student = students.find((s) => s.id === input.studentId) ?? currentStudent;
      const pdfUrl = URL.createObjectURL(input.pdfFile);
      const nextNum =
        Math.max(
          ...logbookReports.filter((r) => r.studentId === input.studentId).map((r) => r.monthNumber),
          0
        ) + 1;

      const entry: LogbookReport = {
        id: `mr-${Date.now()}`,
        studentId: input.studentId,
        studentName: student.name,
        supervisorId: student.supervisorId ?? "sup-001",
        monthNumber: nextNum,
        period: input.period.trim(),
        monthKey: periodToMonthKey(input.period),
        submittedAt: new Date().toISOString(),
        status: "pending",
        excerpt: input.excerpt.trim(),
        pdfUrl,
        pdfFileName: input.pdfFile.name,
        isCurrent: true,
      };

      setLogbookReports((prev) => [
        ...prev.map((r) =>
          r.studentId === input.studentId ? { ...r, isCurrent: false } : r
        ),
        entry,
      ]);

      notifyStudent(
        "Report Submitted Successfully",
        `Your monthly report for ${entry.period} has been submitted and is awaiting supervisor review.`,
        "report_submitted",
        "success"
      );

      pushNotification({
        audience: "supervisor",
        userId: entry.supervisorId,
        title: "New Logbook Submission",
        message: `${student.name} submitted the ${entry.period} report (PDF).`,
        type: "warning",
        category: "report_submitted",
      });

      return entry;
    },
    [logbookReports, notifyStudent, pushNotification, students]
  );

  const reviewLogbookReport = useCallback(
    (input: { reportId: string; status: "accepted" | "rejected"; marks: number; feedback: string }) => {
      setLogbookReports((prev) =>
        prev.map((r) =>
          r.id === input.reportId
            ? {
                ...r,
                status: input.status,
                marks: input.marks,
                feedback: input.feedback,
                reviewedAt: new Date().toISOString(),
              }
            : r
        )
      );

      const report = logbookReports.find((r) => r.id === input.reportId);
      if (!report) return;

      const isAccepted = input.status === "accepted";
      const sid = report.studentId;
      notifyStudent(
        isAccepted ? "Report Accepted" : "Report Rejected",
        `Your ${report.period} report has been ${input.status}. Marks: ${input.marks}. ${input.feedback ? "See supervisor comments in your logbook." : ""}`,
        isAccepted ? "report_accepted" : "report_rejected",
        isAccepted ? "success" : "error",
        sid
      );

      if (input.feedback) {
        notifyStudent("Supervisor Feedback", input.feedback, "report_feedback", "info", sid);
      }

      notifyStudent(
        "Report Review Completed",
        `Supervisor reviewed your ${report.period} submission on ${new Date().toLocaleString()}.`,
        "report_reviewed",
        "info",
        sid
      );
    },
    [logbookReports, notifyStudent]
  );

  const addStudent = useCallback((student: Student) => {
    setStudents((prev) => {
      if (prev.some((s) => s.studentId === student.studentId)) return prev;
      return [...prev, { ...student, allocationStatus: deriveAllocationStatus(student.supervisorId) }];
    });
  }, []);

  const updateStudentRecord = useCallback(
    (studentId: string, patch: Partial<Student>, changeType: string) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, ...patch } : s))
      );
      const student = students.find((s) => s.id === studentId);
      const name = student?.name ?? "Student";
      const when = new Date().toLocaleString();
      notifyAdmin(
        "Student Profile Updated",
        `${name} updated ${changeType} on ${when}.`,
        "profile",
        "warning"
      );
    },
    [notifyAdmin, students]
  );

  const getStudentById = useCallback(
    (id: string) => students.find((s) => s.id === id),
    [students]
  );

  const getReportsForStudent = useCallback(
    (studentId: string) =>
      [...logbookReports]
        .filter((r) => r.studentId === studentId)
        .sort((a, b) => b.monthNumber - a.monthNumber),
    [logbookReports]
  );

  const getReportsForSupervisor = useCallback(
    (supervisorId: string) =>
      [...logbookReports]
        .filter((r) => r.supervisorId === supervisorId)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()),
    [logbookReports]
  );

  const getNotificationsFor = useCallback(
    (audience: AppNotification["audience"], userId?: string) =>
      notifications
        .filter(
          (n) =>
            n.audience === audience &&
            (!userId || !n.userId || n.userId === userId)
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(
    (audience: AppNotification["audience"], userId?: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.audience === audience && (!userId || !n.userId || n.userId === userId)
            ? { ...n, read: true }
            : n
        )
      );
    },
    []
  );

  const recalcSupervisorCounts = useCallback((list: Student[]) => {
    setSupervisors((prev) =>
      prev.map((sup) => ({
        ...sup,
        assignedStudents: list.filter((s) => s.supervisorId === sup.id).length,
      }))
    );
  }, []);

  const allocateStudents = useCallback(
    (studentIds: string[], supervisorId: string | null) => {
      const supervisor = supervisorId
        ? supervisors.find((s) => s.id === supervisorId)
        : undefined;

      setStudents((prev) => {
        const next = prev.map((s) => {
          if (!studentIds.includes(s.id)) return s;
          return {
            ...s,
            supervisorId: supervisorId ?? undefined,
            allocationStatus: deriveAllocationStatus(supervisorId ?? undefined),
          };
        });
        recalcSupervisorCounts(next);
        return next;
      });

      setLogbookReports((prev) =>
        prev.map((r) =>
          studentIds.includes(r.studentId) && supervisorId
            ? { ...r, supervisorId }
            : r
        )
      );

      const label = supervisor?.name ?? "Unassigned";
      studentIds.forEach((id) => {
        const st = students.find((s) => s.id === id);
        notifyStudentById(
          id,
          supervisorId ? "Supervisor Assigned" : "Supervisor Assignment Removed",
          supervisorId
            ? `You have been allocated to ${label}.`
            : "Your supervisor assignment has been removed by administration.",
          "allocation",
          supervisorId ? "success" : "warning"
        );
      });

      if (supervisorId) {
        pushNotification({
          audience: "supervisor",
          userId: supervisorId,
          title: "Students Allocated",
          message: `${studentIds.length} student(s) assigned to you by administration.`,
          type: "info",
          category: "allocation",
        });
      }

      notifyAdmin(
        "Allocation Updated",
        `${studentIds.length} student(s) ${supervisorId ? `assigned to ${label}` : "unassigned"}.`,
        "allocation",
        "info"
      );
    },
    [
      supervisors,
      students,
      recalcSupervisorCounts,
      notifyStudentById,
      pushNotification,
      notifyAdmin,
    ]
  );

  const getSupervisorById = useCallback(
    (id: string) => supervisors.find((s) => s.id === id),
    [supervisors]
  );

  const getStudentsBySupervisor = useCallback(
    (supervisorId: string) => students.filter((s) => s.supervisorId === supervisorId),
    [students]
  );

  const getAssignedSupervisorForStudent = useCallback(
    (studentId: string) => {
      const st = students.find((s) => s.id === studentId);
      if (!st?.supervisorId) return undefined;
      return supervisors.find((s) => s.id === st.supervisorId);
    },
    [students, supervisors]
  );

  const getTargetStudentIds = useCallback(
    (target: AnnouncementTarget, supervisorId?: string) => {
      if (target === "all_students") return students.map((s) => s.id);
      if (!supervisorId) return [];
      return students.filter((s) => s.supervisorId === supervisorId).map((s) => s.id);
    },
    [students]
  );

  const publishAnnouncement = useCallback(
    (input: {
      title: string;
      message: string;
      priority: AnnouncementPriority;
      target: AnnouncementTarget;
      authorId: string;
      authorName: string;
      authorRole: AnnouncementAuthorRole;
      supervisorId?: string;
      linkUrl?: string;
      attachmentName?: string;
      scheduledAt?: string;
      category?: Announcement["category"];
    }) => {
      const now = new Date();
      const scheduled = input.scheduledAt ? new Date(input.scheduledAt) : null;
      const isScheduledFuture = scheduled && scheduled > now;

      const entry: Announcement = {
        id: `ann-${Date.now()}`,
        title: input.title.trim(),
        message: input.message.trim(),
        authorId: input.authorId,
        authorName: input.authorName,
        authorRole: input.authorRole,
        priority: input.priority,
        target: input.target,
        supervisorId: input.supervisorId,
        linkUrl: input.linkUrl,
        attachmentName: input.attachmentName,
        scheduledAt: input.scheduledAt,
        publishedAt: isScheduledFuture ? undefined : now.toISOString(),
        createdAt: now.toISOString(),
        category: input.category ?? "general",
      };

      setAnnouncements((prev) => [entry, ...prev]);

      if (!isScheduledFuture) {
        const targetIds = getTargetStudentIds(input.target, input.supervisorId);
        targetIds.forEach((studentId) => {
          notifyStudentById(
            studentId,
            `New Announcement: ${entry.title}`,
            entry.message.slice(0, 120) + (entry.message.length > 120 ? "…" : ""),
            "announcement",
            entry.priority === "urgent" ? "warning" : "info"
          );
        });
      }

      return entry;
    },
    [getTargetStudentIds, notifyStudentById]
  );

  const isAnnouncementVisibleToStudent = useCallback(
    (a: Announcement, student: Student) => {
      const now = new Date();
      if (a.scheduledAt && new Date(a.scheduledAt) > now) return false;
      if (!a.publishedAt && a.scheduledAt) return false;
      if (a.target === "all_students") return true;
      return (
        a.target === "supervisor_students" &&
        !!a.supervisorId &&
        student.supervisorId === a.supervisorId
      );
    },
    []
  );

  const getPublishedAnnouncementsForStudent = useCallback(
    (studentId: string) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return [];
      return announcements
        .filter((a) => isAnnouncementVisibleToStudent(a, student))
        .filter((a) => a.publishedAt || !a.scheduledAt || new Date(a.scheduledAt) <= new Date())
        .sort(
          (a, b) =>
            new Date(b.publishedAt ?? b.createdAt).getTime() -
            new Date(a.publishedAt ?? a.createdAt).getTime()
        );
    },
    [announcements, students, isAnnouncementVisibleToStudent]
  );

  const getAllAnnouncements = useCallback(
    () =>
      [...announcements].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [announcements]
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      companies,
      students,
      supervisors,
      announcements,
      logbookReports,
      notifications,
      addCompany,
      updateCompany,
      removeCompany,
      getApprovedCompanies,
      submitLogbookReport,
      reviewLogbookReport,
      updateStudentRecord,
      addStudent,
      getStudentById,
      getReportsForStudent,
      getReportsForSupervisor,
      getNotificationsFor,
      markNotificationRead,
      markAllNotificationsRead,
      allocateStudents,
      getSupervisorById,
      getStudentsBySupervisor,
      getAssignedSupervisorForStudent,
      publishAnnouncement,
      getPublishedAnnouncementsForStudent,
      getAllAnnouncements,
    }),
    [
      companies,
      students,
      supervisors,
      announcements,
      logbookReports,
      notifications,
      addCompany,
      updateCompany,
      removeCompany,
      getApprovedCompanies,
      submitLogbookReport,
      reviewLogbookReport,
      updateStudentRecord,
      addStudent,
      getStudentById,
      getReportsForStudent,
      getReportsForSupervisor,
      getNotificationsFor,
      markNotificationRead,
      markAllNotificationsRead,
      allocateStudents,
      getSupervisorById,
      getStudentsBySupervisor,
      getAssignedSupervisorForStudent,
      publishAnnouncement,
      getPublishedAnnouncementsForStudent,
      getAllAnnouncements,
    ]
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
