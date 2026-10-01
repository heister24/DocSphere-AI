import redis from "../configs/redis.js";

const OTP_PREFIX = "auth:otp;";

export const getOTPKey = (purpose, email) => {
  return `${OTP_PREFIX}${purpose}:${email.toLowerCase()}`;
};

export const storeOTP = async ({ email, purpose, otp }) => {
  const key = getOTPKey(purpose, email);
  const expiry = Number(process.env.OTP_EXPIRY);
  await redis.set(key, otp, "EX", expiry);
};

export const getOTP = async ({ email, purpose }) => {
  const key = getOTPKey(purpose, email);
  return redis.get(key);
};

export const deleteOTP = async ({ email, purpose }) => {
  const key = getOTPKey(purpose, email);
  await redis.del(key);
};
