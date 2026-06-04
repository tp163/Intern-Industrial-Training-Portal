const CV_KEY = "internship-student-cv";

export function getStoredCvFileName(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CV_KEY);
}

export function setStoredCvFileName(name: string | null) {
  if (typeof window === "undefined") return;
  if (name) sessionStorage.setItem(CV_KEY, name);
  else sessionStorage.removeItem(CV_KEY);
}

export function getInitialCvFileName(fallback?: string | null): string | null {
  return getStoredCvFileName() ?? fallback ?? null;
}
