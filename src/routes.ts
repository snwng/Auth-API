import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";

const router = express.Router();

router.get("/", (req, res) =>
  res.status(200).json({ status: "OK", timestamp: new Date() }),
);

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
