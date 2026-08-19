import express from "express";
import { createStudent, listStudents, getStudent } from "./students.controller.js";
import { checkRole } from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", listStudents);
router.get("/:id", getStudent);
// protect creation to admin and supervisor
// For initial testing allow unauthenticated POST; add auth middleware later
router.post("/", checkRole("admin"), createStudent);

export default router;
