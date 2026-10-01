import User from "../models/user.model.js";
import sendOTPEmail from "../services/email.service.js";
import { storeOTP } from "../services/otp.service.js";
import generateOTP from "../utils/generateOTP.js";

export const sendOTP = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required for register",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this email",
      });
    }
    const otp = generateOTP();

    await storeOTP({
      email: normalizedEmail,
      otp,
      purpose: "register",
    });

    await sendOTPEmail({
      otp,
      email: normalizedEmail,
      purpose: "register",
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(`Error while sending OTP : ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
