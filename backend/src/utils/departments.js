export const departmentOptions = ["CMIS", "ELTN", "IMGT", "MATH & STAT"];

const legacyDepartmentMap = {
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

export function normalizeDepartment(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (departmentOptions.includes(trimmed)) return trimmed;
  return legacyDepartmentMap[trimmed.toLowerCase()] ?? null;
}
