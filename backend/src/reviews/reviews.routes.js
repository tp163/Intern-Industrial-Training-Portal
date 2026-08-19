import express from "express";
import { listReviews, createReview, getReview, updateReview, deleteReview } from "./reviews.controller.js";
import { requireStudentEligibleInternshipStatus } from "../middleware/require-student-eligible-internship-status.js";

const router = express.Router();

router.get("/", listReviews);
router.post("/", requireStudentEligibleInternshipStatus, createReview);
router.get("/:id", getReview);
router.put("/:id", requireStudentEligibleInternshipStatus, updateReview);
router.delete("/:id", deleteReview);

export default router;
