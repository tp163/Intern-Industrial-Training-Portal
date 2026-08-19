import express from "express";
import { checkRole } from "../auth/auth.middleware.js";
import {
  listAnnouncements,
  createAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "./announcements.controller.js";

const router = express.Router();

router.get("/", listAnnouncements);
router.post("/", checkRole("admin", "supervisor"), createAnnouncement);
router.get("/:id", getAnnouncement);
router.put("/:id", checkRole("admin", "supervisor"), updateAnnouncement);
router.delete("/:id", checkRole("admin", "supervisor"), deleteAnnouncement);

export default router;
