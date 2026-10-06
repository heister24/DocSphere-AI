import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { UserPlus, Mail, Lock, KeyRound } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        toast.error("Email is required.");
        setLoading(false);
        return;
      }

      const response = await api.post("/auth/register/request-otp", {
        email: trimmedEmail,
      });

      // console.log(response);
      const data = response.data;

      if (data.success) {
        toast.success("OTP sent to your email.");
        setStep(2);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Unable to send OTP.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
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

      const response = await api.post("/auth/register/verify-otp", {
        email: email.trim().toLowerCase(),
        otp,
        password,
      });

      if (response.data?.success) {
        dispatch(setUserData(response.data.user));
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 font-sans selection:bg-slate-900 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-slate-900 hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-120">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-2xl sm:px-12 ring-1 ring-slate-900/5">
          <form
            onSubmit={step === 1 ? handleSendOtp : handleRegister}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="block w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <KeyRound
                        className="h-5 w-5 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="block w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock
                        className="h-5 w-5 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm"
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
                    Confirm password
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock
                        className="h-5 w-5 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="block w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm sm:leading-6 transition-colors shadow-sm"
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
                  ? "Sending code..."
                  : "Creating account..."
                : step === 1
                  ? "Continue with Email"
                  : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
