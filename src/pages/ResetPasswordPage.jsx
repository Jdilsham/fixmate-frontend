import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";

const API = import.meta.env.VITE_BACKEND_URL;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email || localStorage.getItem("resetPasswordEmail");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!otp || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/api/auth/reset-password`, {
        email,
        otp,
        newPassword: password,
      });

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <PageBackground />

      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/10 bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_20px_80px_-55px_rgba(0,0,0,0.55)]">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-cyan-400 dark:via-blue-400 dark:to-emerald-400">
              Reset Password
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-8">
            {/* OTP */}
            <div className="relative">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/15 outline-none focus:border-orange-500 dark:focus:border-cyan-400"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                OTP Code
              </label>
            </div>

            {/* password */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/15 outline-none focus:border-orange-500 dark:focus:border-cyan-400"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                New Password
              </label>
            </div>

            {/* confirm */}
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/15 outline-none focus:border-orange-500 dark:focus:border-cyan-400"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Confirm Password
              </label>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full h-12 rounded-2xl font-semibold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-cyan-500 dark:via-blue-500 dark:to-emerald-500 shadow-lg"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}