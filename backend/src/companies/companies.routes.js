import express from "express";
import { checkRole } from "../auth/auth.middleware.js";
import { listCompanies, createCompany, getCompany, updateCompany, deleteCompany } from "./companies.controller.js";

const router = express.Router();

router.get("/", listCompanies);
router.post("/", checkRole("admin"), createCompany);
router.get("/:id", getCompany);
router.put("/:id", checkRole("admin"), updateCompany);
router.delete("/:id", checkRole("admin"), deleteCompany);

export default router;
