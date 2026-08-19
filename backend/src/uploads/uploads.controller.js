import { supabase } from "../config/supabase.js";
import crypto from "node:crypto";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    const extension = req.file.originalname.includes(".")
      ? req.file.originalname.slice(req.file.originalname.lastIndexOf(".")).toLowerCase()
      : "";
    const filePath = `${req.user.id}/${Date.now()}_${crypto.randomUUID()}${extension}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

    if (error) return res.status(500).json({ success: false, message: error.message, error });

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;

    res.status(201).json({ success: true, url: publicUrl, path: data.path });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
