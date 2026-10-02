import User from "../models/user.model.js";
import sendOTPEmail from "../services/email.service.js";
import { deleteOTP, getOTP, storeOTP } from "../services/otp.service.js";
import generateJWTToken from "../utils/generateJWTToken.js";
import generateOTP from "../utils/generateOTP.js";
import bcrypt from "bcrypt";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for register",
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

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Data missing for verification for registeration",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const storedOTP = await getOTP({
      email: normalizedEmail,
      purpose: "register",
    });

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired or not found",
      });
    }

    if (Number(storedOTP) !== Number(otp)) {
      return res.status(403).json({
        success: false,
        message: "OTP is incorrect, try again",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: true,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    await deleteOTP({
      email: normalizedEmail,
      purpose: "register",
    });

    const token = generateJWTToken(user._id);

    res.cookie("docsphereAuthToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered Successfully",
      user: userResponse,
    });
  } catch (error) {
    console.log(`otp verification controller error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

