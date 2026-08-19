import express from "express";
import { listProgressReports, createProgressReport, getProgressReport, updateProgressReport, deleteProgressReport } from "./progress_reports.controller.js";
import { requireStudentEligibleInternshipStatus } from "../middleware/require-student-eligible-internship-status.js";

const router = express.Router();

router.get("/", listProgressReports);
router.post("/", requireStudentEligibleInternshipStatus, createProgressReport);
router.get("/:id", getProgressReport);
router.put("/:id", requireStudentEligibleInternshipStatus, updateProgressReport);
router.delete("/:id", deleteProgressReport);

export default router;
