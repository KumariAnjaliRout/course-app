import express from "express";
import { login, logout, signup, dashboard } from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/dashboard", adminMiddleware, dashboard);

export default router;
