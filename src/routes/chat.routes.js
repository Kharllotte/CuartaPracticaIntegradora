import { Router } from "express";
import authMiddleware from "../helpers/auth.js";

const router = Router();

router.get("/", authMiddleware.isLoggedIn, authMiddleware.isUser, async (req, res) => {
  res.render("chat");
});

export default router;
