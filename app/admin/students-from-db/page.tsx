"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Student = {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  departmentCode?: string;
  batch?: string;
  created_at?: string;
};

export default function StudentsFromDbPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await authFetch(`${API_BASE}/users`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load students");
        }

        const mapped = (result.data || [])
          .filter((u: any) => u.role === "student")
          .map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          studentId: u.student_id,
          departmentCode: u.department,
          batch: u.batch,
          created_at: u.created_at
        }));

        if (mounted) setStudents(mapped);
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading students from database…</div>;
  if (error) return <div>Error loading students: {error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Students (from Supabase)</h1>
      <div>
        {students.length === 0 && <div>No students found in database.</div>}
        <ul className="space-y-2">
          {students.map((s) => (
            <li key={s.id} className="rounded border p-3">
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">{s.email}</div>
              <div className="text-xs text-gray-500">{s.studentId ?? "-"} · {s.departmentCode ?? "-"} · {s.batch ?? "-"}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
