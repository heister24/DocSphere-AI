import jwt from "jsonwebtoken";
import "dotenv/config";

const generateJWTToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export default generateJWTToken;
