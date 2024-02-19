import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", (req, res, next) => {
  return res.send("GET USER");
});

export default userRoutes;
