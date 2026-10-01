import crypto from "crypto";

const generateOTP = (length = Number(process.env.OTP_LENGTH) || 6) => {
  const len = Number(length) || 6;
  const min = 10 ** (len - 1);
  const max = 10 ** len;
  return crypto.randomInt(min, max).toString();
};

export default generateOTP;
