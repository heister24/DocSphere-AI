import express from "express";
import { sendOTP } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register/request-otp", sendOTP);

export default authRoutes;
