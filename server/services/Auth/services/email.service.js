import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTPEmail = async ({ otp, email, purpose }) => {
  let subject;
  let message;

  if (purpose === "register") {
    subject = "DocSphere AI - Verify your email";
    message = `
      Your DocSphere AI verification code is:

      ${otp}

      This code will expire in 5 minutes.

      If you did not request this code, you can ignore this email.
    `;
  }

  if (purpose === "forgot-password") {
    subject = "DocSphere AI - Password reset OTP";
    message = `
      Your DocSphere AI password reset code is:

      ${otp}

      This code will expire in 5 minutes.

      If you did not request a password reset, you can ignore this email.
    `;
  }

  await transporter.sendMail({
    from: `"DocSphere AI" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text: message,
  });
};

export default sendOTPEmail;
