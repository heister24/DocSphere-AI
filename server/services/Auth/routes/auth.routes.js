import express from "express";
import {
  login,
  sendOTPForForgotPassword,
  sendOTPForRegister,
  verifyOTPForForgotPassword,
  verifyOTPForRegister,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register/request-otp", sendOTPForRegister);
authRoutes.post("/register/verify-otp", verifyOTPForRegister);
authRoutes.post("/login", login);
authRoutes.post("/forgot-password/request-otp", sendOTPForForgotPassword);
authRoutes.put("/forgot-password/verify-otp", verifyOTPForForgotPassword);

export default authRoutes;
