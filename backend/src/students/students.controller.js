import { supabase } from "../config/supabase.js";
import { normalizeDepartment } from "../utils/departments.js";

const isValidStudentId = (value = "") => /^\d{6}$/.test(String(value));

function getDepartmentCode(row) {
  return normalizeDepartment(row.department_code ?? row.department);
}

function toStudentShape(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: "student",
    studentId: row.student_id ?? "",
    program: row.program ?? "",
    year: row.year ?? 1,
    gpa: row.gpa ?? null,
    phone: row.phone ?? null,
    faculty: row.faculty ?? null,
    department: getDepartmentCode(row),
    departmentCode: getDepartmentCode(row),
    batch: row.batch ?? null,
    internshipStatus: row.internship_status ?? "not_placed",
    internshipCompany: row.internship_company ?? null,
    internshipRole: row.internship_role ?? null,
    supervisorId: row.supervisor_id ?? null,
    allocationStatus: row.allocation_status ?? (row.supervisor_id ? "allocated" : "unassigned"),
    cvUrl: row.cv_url ?? null,
    cvFileName: row.cv_file_name ?? null,
    permissions: row.permissions ?? {},
    createdAt: (row.created_at ?? "").slice(0, 10),
  };
}

export const listStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "student")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.json({ success: true, data: (data ?? []).map(toStudentShape) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.params.id)
      .eq("role", "student")
      .single();
    if (error) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: toStudentShape(data) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const p = req.body;
    if (!p.name || !p.studentId || !p.email) {
      return res.status(400).json({ success: false, message: "name, studentId and email are required" });
    }
    if (!isValidStudentId(p.studentId)) {
      return res.status(400).json({ success: false, message: "Student ID must be exactly 6 digits, for example 222111" });
    }
    const row = {
      name: p.name,
      email: p.email,
      role: "student",
      student_id: p.studentId,
      program: p.program ?? null,
      year: p.year ?? null,
      gpa: p.gpa ?? null,
      phone: p.phone ?? null,
      faculty: p.faculty ?? null,
      department: normalizeDepartment(p.department) ?? null,
      department_code: normalizeDepartment(p.departmentCode ?? p.department) ?? null,
      batch: p.batch ?? null,
      internship_status: p.internshipStatus ?? "not_placed",
      supervisor_id: p.supervisorId ?? null,
      allocation_status: p.supervisorId ? "allocated" : "unassigned",
      password_hash: p.password_hash ?? "",
    };
    const { data, error } = await supabase.from("users").insert([row]).select().single();
    if (error) return res.status(500).json({ success: false, message: error.message });
    res.status(201).json({ success: true, data: toStudentShape(data) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    if (
      req.body.student_id !== undefined &&
      req.body.student_id !== null &&
      !isValidStudentId(req.body.student_id)
    ) {
      return res.status(400).json({ success: false, message: "Student ID must be exactly 6 digits, for example 222111" });
    }
    const { data, error } = await supabase
      .from("users")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data: toStudentShape(data) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { error } = await supabase.from("users").delete().eq("id", req.params.id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
