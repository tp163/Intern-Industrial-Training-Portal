import express from "express";
import { checkRole } from "../auth/auth.middleware.js";
import { listInternships, createInternship, getInternship, updateInternship, deleteInternship } from "./internships.controller.js";

const router = express.Router();

router.get("/", listInternships);
router.post("/", checkRole("admin"), createInternship);
router.get("/:id", getInternship);
router.put("/:id", checkRole("admin"), updateInternship);
router.delete("/:id", checkRole("admin"), deleteInternship);

export default router;
