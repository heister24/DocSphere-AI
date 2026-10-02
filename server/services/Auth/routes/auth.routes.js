import express from "express";
import { sendOTP, verifyOTP } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register/request-otp", sendOTP);
authRoutes.post("/register/verify-otp", verifyOTP);

export default authRoutes;
