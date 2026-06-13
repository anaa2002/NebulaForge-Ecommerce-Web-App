import express from "express";
import {
  getMe,
  login,
  logout,
  refreshAccessToken,
  signup,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/logout", logout);

authRouter.get("/me", authMiddleware, getMe);

export default authRouter;
