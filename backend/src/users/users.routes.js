import express from "express";
import { listUsers, getUser, createUser, updateUser, deleteUser } from "./users.controller.js";
import { requireAdmin } from "../auth/auth.middleware.js";

const router = express.Router();

router.get("/", listUsers);
router.post("/", requireAdmin, createUser);
router.put("/:id", updateUser);
router.delete("/:id", requireAdmin, deleteUser);
router.get("/:id", getUser);

export default router;
