import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../Controller/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// PUBLIC ROUTES (no authentication required)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// PROTECTED ROUTES (authentication required)
router.put("/updateprofile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;