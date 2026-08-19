import express from "express";
import { listSupervisors, getSupervisor } from "./supervisors.controller.js";

const router = express.Router();

router.get("/", listSupervisors);
router.get("/:id", getSupervisor);

export default router;
