import type { DepartmentCategory } from "@/types";

export const departmentOptions = ["CMIS", "ELTN", "IMGT", "MATH & STAT"] as const;

export const departmentNames: Record<DepartmentCategory, string> = {
  CMIS: "Computing and Information Systems",
  ELTN: "Electronics",
  IMGT: "Industrial Management",
  "MATH & STAT": "Mathematical Sciences",
};

const legacyDepartmentMap: Record<string, DepartmentCategory> = {
  cmis: "CMIS",
  "computing and information systems": "CMIS",
  "computer science": "CMIS",
  "software engineering": "CMIS",
  "faculty of computing": "CMIS",
  eltn: "ELTN",
  electronics: "ELTN",
  electronic: "ELTN",
  "faculty of engineering": "ELTN",
  imgt: "IMGT",
  "industrial management": "IMGT",
  management: "IMGT",
  "faculty of management": "IMGT",
  "math & stat": "MATH & STAT",
  "math and stat": "MATH & STAT",
  "mathematical sciences": "MATH & STAT",
  mathematics: "MATH & STAT",
  statistics: "MATH & STAT",
};

export function normalizeDepartment(value?: string | null): DepartmentCategory | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if ((departmentOptions as readonly string[]).includes(trimmed)) {
    return trimmed as DepartmentCategory;
  }
  return legacyDepartmentMap[trimmed.toLowerCase()];
}

export function normalizeDepartments(values: unknown): DepartmentCategory[] {
  const source = Array.isArray(values) ? values : values ? [values] : [];
  return Array.from(
    new Set(source.map((value) => normalizeDepartment(String(value))).filter(Boolean) as DepartmentCategory[])
  );
}

export function formatDepartment(value?: string | null): string {
  const code = normalizeDepartment(value);
  return code ? `${code} (${departmentNames[code]})` : "Unassigned";
}
