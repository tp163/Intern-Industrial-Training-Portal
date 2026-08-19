import express from "express";
import { listLogbookReports, createLogbookReport, getLogbookReport, updateLogbookReport, deleteLogbookReport } from "./logbook_reports.controller.js";
import { requireStudentEligibleInternshipStatus } from "../middleware/require-student-eligible-internship-status.js";

const router = express.Router();

router.get("/", listLogbookReports);
router.post("/", requireStudentEligibleInternshipStatus, createLogbookReport);
router.get("/:id", getLogbookReport);
router.put("/:id", requireStudentEligibleInternshipStatus, updateLogbookReport);
router.delete("/:id", deleteLogbookReport);

export default router;
