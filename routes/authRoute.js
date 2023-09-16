import { login, me, logout } from "../controllers/Auth.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.get("/me", me);
router.delete("/logout", logout);

export default router;
