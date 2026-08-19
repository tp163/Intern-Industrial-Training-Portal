import { supabase } from "../config/supabase.js";

export const listReviews = async (req, res) => {
  try {
    const { data, error } = await supabase.from("reviews").select("*").order("submitted_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("reviews").insert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("reviews").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("reviews").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
