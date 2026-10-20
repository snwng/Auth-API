import express from "express";
import { authenticate } from "../../middlewares/auth";
import { getUser } from "./user.controller";

const router = express.Router();
router.use(authenticate);

router.get("/me", getUser);

export default router;
