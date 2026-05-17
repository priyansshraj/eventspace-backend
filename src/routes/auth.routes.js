import express from "express";
import { register, login, getProfile} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router =express.Router();

router.get("/me", authMiddleware, getProfile);
router.post("/register", register);
router.post("/login", login);

export default router;