import { supabase } from "../config/supabase.js";
import { normalizeDepartment } from "../utils/departments.js";

function toSupervisorShape(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: "supervisor",
    title: row.title ?? "Faculty Supervisor",
    phone: row.phone ?? null,
    department: normalizeDepartment(row.department),
    assignedStudents: row.assigned_students ?? 0,
    createdAt: (row.created_at ?? "").slice(0, 10),
  };
}

export const listSupervisors = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "supervisor")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, data: (data ?? []).map(toSupervisorShape) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSupervisor = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.params.id)
      .eq("role", "supervisor")
      .single();
    if (error) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: toSupervisorShape(data) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
