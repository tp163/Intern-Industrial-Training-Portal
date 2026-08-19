import express from "express";
import { checkRole } from "../auth/auth.middleware.js";
import {
  createReportDeadline,
  deleteReportDeadline,
  listReportDeadlines,
  updateReportDeadline,
} from "./report_deadlines.controller.js";

const router = express.Router();

router.get("/", listReportDeadlines);
router.post("/", checkRole("admin", "supervisor"), createReportDeadline);
router.put("/:id", checkRole("admin", "supervisor"), updateReportDeadline);
router.delete("/:id", checkRole("admin", "supervisor"), deleteReportDeadline);

export default router;
