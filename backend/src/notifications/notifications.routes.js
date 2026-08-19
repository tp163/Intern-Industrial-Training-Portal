import express from "express";
import { listNotifications, createNotification, getNotification, updateNotification, deleteNotification } from "./notifications.controller.js";

const router = express.Router();

router.get("/", listNotifications);
router.post("/", createNotification);
router.get("/:id", getNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
