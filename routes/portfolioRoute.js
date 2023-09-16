import {
  get,
  create,
  getById,
  update,
  destroy,
} from "../controllers/portfolioController.js";
import express from "express";
import { verifyUser } from "../middleware/authUser.js";
import { verify } from "argon2";

const router = express.Router();

router.get("/portfolio", get);
router.post("/portfolio", verifyUser, create);
router.get("/portfolio/:id", getById);
router.patch("/portfolio/:id", verifyUser, update);
router.delete("/portfolio/:id", verifyUser, destroy);

export default router;
