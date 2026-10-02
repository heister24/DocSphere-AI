import express from "express";
import {
  getMe,
  login,
  logout,
  sendOTPForForgotPassword,
  sendOTPForRegister,
  verifyOTPForForgotPassword,
  verifyOTPForRegister,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.midlleware.js";

const authRoutes = express.Router();

authRoutes.post("/register/request-otp", sendOTPForRegister);
authRoutes.post("/register/verify-otp", verifyOTPForRegister);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password/request-otp", sendOTPForForgotPassword);
authRoutes.put("/forgot-password/verify-otp", verifyOTPForForgotPassword);
authRoutes.get("/get-user", authMiddleware, getMe);
authRoutes.get("/logout", authMiddleware, logout);

export default authRoutes;
