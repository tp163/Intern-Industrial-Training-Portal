import express from "express";
import { requireAdmin } from "../auth/auth.middleware.js";
import { listSystemSettings, upsertSystemSetting } from "./system_settings.controller.js";

const router = express.Router();

router.get("/", listSystemSettings);
router.post("/", requireAdmin, upsertSystemSetting);

export default router;
