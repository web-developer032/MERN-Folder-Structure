import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getUser } from "./user.handlers";

const userRoutes = Router();

userRoutes.get("/", protect, getUser);

export default userRoutes;
