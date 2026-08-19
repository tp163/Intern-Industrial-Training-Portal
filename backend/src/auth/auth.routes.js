import express from "express";
import { register, login, forgotPassword, resetPassword } from "./auth.controller.js";
import { rateLimit } from "./rate-limit.js";

const router = express.Router();

router.post("/register", rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), register);
router.post("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), login);
router.post("/forgot-password", rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), forgotPassword);
router.post("/reset-password", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), resetPassword);

export default router;
