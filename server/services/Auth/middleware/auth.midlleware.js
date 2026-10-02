import jwt from "jsonwebtoken";
import { cacheUser, getCachedUser } from "../services/userCache.service.js";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.docsphereAuthToken;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(400).json({
        success: false,
        message: "Decoded token not found",
      });
    }

    const userId = decodedToken.userId; // we used decodedToken.userId bcs when we generated token there we used userId

    let user = await getCachedUser(userId);
    if (user) {
      req.user = user;
      return next();
    }

    user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    await cacheUser(user);
    req.user = user;

    next();
  } catch (error) {
    console.log(`Auth middleware error :  ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error at Auth middleware",
    });
  }
};

export default authMiddleware;
