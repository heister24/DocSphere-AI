import jwt from "jsonwebtoken";
import "dotenv/config";

const authGateway = async (req, res, next) => {
  try {
    const token = req.cookies?.docsphereAuthToken;
    // console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token missing or not found" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Decoded token missing or not found",
      });
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default authGateway;
