import express from "express";
import { listApplications, createApplication, getApplication, updateApplication, deleteApplication } from "./applications.controller.js";

const router = express.Router();

router.get("/", listApplications);
router.post("/", createApplication);
router.get("/:id", getApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
