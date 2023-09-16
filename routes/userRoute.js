import express from "express";
import {
  get,
  create,
  getById,
  update,
  destroy,
} from "../controllers/userController.js";
import { verifyUser, isAdmin } from "../middleware/authUser.js";

const route = express.Router();

route.get("/user", verifyUser, isAdmin, get);
route.post("/user", verifyUser, isAdmin, create);
route.get("/user/:id", verifyUser, isAdmin, getById);
route.patch("/user/:id", verifyUser, isAdmin, update);
route.delete("/user/:id", verifyUser, isAdmin, destroy);

export default route;
