import { supabase } from "../config/supabase.js";

export const listSystemSettings = async (req, res) => {
  try {
    const { data, error } = await supabase.from("system_settings").select("*");
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const upsertSystemSetting = async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from("system_settings").upsert([payload]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
