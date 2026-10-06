import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { Box } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password/request-otp", {
        email,
      });
      if (response.data?.success) {
        toast.success("OTP sent to your email.");
        setStep(2);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to process request.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !otp || !password || !confirmPassword) {
        toast.error("All fields are required.");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        setLoading(false);
        return;
      }

      const response = await api.put("/auth/forgot-password/verify-otp", {
        email: email.trim().toLowerCase(),
        otp,
        password,
      });

      if (response.data?.success) {
        toast.success("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to reset password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 font-sans selection:bg-slate-900 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
          <Box className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          {step === 1
            ? "Enter your email and we'll send you an OTP."
            : "Enter the OTP and your new password."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-120">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-2xl sm:px-12 ring-1 ring-slate-900/5">
          <form
            onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="block w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
                  disabled={step === 2}
                  required
                />
              </div>
            </div>

            {step === 2 && (
              <>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Verification Code (OTP)
                  </label>
                  <div className="mt-2">
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="block w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    New Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Confirm new password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="block w-full rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full justify-center rounded-md bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? step === 1
                  ? "Sending..."
                  : "Resetting..."
                : step === 1
                  ? "Send OTP"
                  : "Reset Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-900 hover:underline transition-all"
            >
              <span aria-hidden="true">&larr;</span> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
