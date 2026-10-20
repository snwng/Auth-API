import express from "express";
import { signUp, logIn, refreshToken, logOut } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logOut);

export default router;
