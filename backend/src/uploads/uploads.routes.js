import express from "express";
import multer from "multer";
import { uploadFile } from "./uploads.controller.js";
import { rateLimit } from "../auth/rate-limit.js";

const router = express.Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowed = new Set(["application/pdf", "image/png", "image/jpeg", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
    callback(null, allowed.has(file.mimetype));
  },
});

router.post("/", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }), upload.single("file"), uploadFile);

export default router;
