import { supabase } from "../config/supabase.js";

export const listCompanies = async (req, res) => {
  try {
    const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCompany = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      // Admin-created companies are immediately available in the directory.
      // This also protects the NOT NULL database constraint when older clients
      // omit the status field.
      status: req.body.status || "approved",
    };
    const { data, error } = await supabase.from("companies").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("companies").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
