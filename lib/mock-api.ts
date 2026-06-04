import { studentRegistry, students } from "@/data/mock";
import type { Student } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const lookupPool = [...studentRegistry, ...students];

export async function fetchStudentByStudentId(studentId: string): Promise<Student | null> {
  await delay(700);
  const normalized = studentId.trim().toUpperCase();
  if (!normalized) return null;
  return lookupPool.find((s) => s.studentId.toUpperCase() === normalized) ?? null;
}

/** Demo IDs: registry (new) + existing students */
export const registeredStudentIds = lookupPool.map((s) => s.studentId);
