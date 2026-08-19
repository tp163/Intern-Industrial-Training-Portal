import { supabase } from "../config/supabase.js";
import { normalizeDepartment } from "../utils/departments.js";

const normalizeDepartments = (value) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(values.map((item) => normalizeDepartment(item)).filter(Boolean))];
};

const internshipDepartmentFields = (row) => {
  const departments = normalizeDepartments(row.department_categories ?? row.department_category);
  return {
    department_categories: departments,
    department_category: departments[0] ?? null,
  };
};

const isFutureDate = (value) => {
  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today;
};

export const listInternships = async (req, res) => {
  try {
    const { data, error } = await supabase.from("internships").select("*").order("deadline", { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({
      success: true,
      data: (data ?? []).map((row) => ({
        ...row,
        ...internshipDepartmentFields(row),
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createInternship = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title?.trim() || !payload.company_name?.trim()) {
      return res.status(400).json({ success: false, message: "Title and company name are required" });
    }
    if (!Number.isInteger(Number(payload.slots)) || Number(payload.slots) < 1) {
      return res.status(400).json({ success: false, message: "Slots must be at least 1" });
    }
    if (!isFutureDate(payload.deadline)) {
      return res.status(400).json({ success: false, message: "Deadline cannot be in the past" });
    }
    // Accept both API naming styles, then resolve the company against the
    // database. The UI may briefly contain an optimistic id after a company is
    // created, so never pass an unknown/empty id to the not-null FK column.
    let companyId = payload.company_id ?? payload.companyId;
    if (companyId === "" || companyId === null) companyId = undefined;
    if (!companyId) {
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .ilike("name", payload.company_name.trim())
        .maybeSingle();
      if (companyError) return res.status(400).json({ success: false, message: companyError.message });
      companyId = company?.id;
    } else {
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("id", companyId)
        .maybeSingle();
      if (companyError || !company) {
        const { data: namedCompany, error: namedCompanyError } = await supabase
          .from("companies")
          .select("id")
          .ilike("name", payload.company_name.trim())
          .maybeSingle();
        if (namedCompanyError) return res.status(400).json({ success: false, message: namedCompanyError.message });
        companyId = namedCompany?.id;
      }
    }
    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Please select a company from the Company Directory before posting the internship.",
      });
    }
    const row = {
      ...payload,
      company_id: companyId,
      ...internshipDepartmentFields({
        department_categories: payload.department_categories,
        department_category: payload.department_category,
      }),
    };
    let { data, error } = await supabase.from("internships").insert([row]).select().single();
    // Some deployed databases still have an older department check constraint.
    // Department is optional, so retry without it when that constraint rejects
    // the value; publishing the listing must not be blocked by this metadata.
    if (error && (error.code === "23514" || error.message?.includes("internships_department_category_check"))) {
      const fallbackRow = { ...row };
      delete fallbackRow.department_category;
      ({ data, error } = await supabase.from("internships").insert([fallbackRow]).select().single());
    }
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("internships").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data: { ...data, ...internshipDepartmentFields(data) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      ...(req.body.department_categories !== undefined || req.body.department_category !== undefined
        ? internshipDepartmentFields({
            department_categories: req.body.department_categories,
            department_category: req.body.department_category,
          })
        : {}),
    };
    const { data, error } = await supabase.from("internships").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("internships").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
