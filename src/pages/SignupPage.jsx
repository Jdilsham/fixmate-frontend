import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";

// import GoogleLoginButton from "@/components/LoginSignup/GoogleLoginButton";
// import { jwtDecode } from "jwt-decode";

const API = import.meta.env.VITE_BACKEND_URL;

export default function SignupPage() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [role, setrole] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignup() {
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      toast.error("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API}/api/auth/signup`, {
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });
      console.log("Signup successful:", response.data);
      toast.success("Signup successful! Please login.");
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup failed:", error);

      if (error.response?.data) {
        const errors = error.response.data;

        if (typeof errors === "object" && !Array.isArray(errors)) {
          const firstError = Object.values(errors)[0];
          toast.error(firstError);
          return;
        }

        if (errors.message) {
          toast.error(errors.message);
          return;
        }
      }

      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <PageBackground />

      <div className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 py-10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-10 left-[-120px] h-64 w-64 rounded-full blur-3xl bg-fuchsia-400/25 dark:bg-fuchsia-400/18" />
          <div className="absolute top-10 right-[-140px] h-72 w-72 rounded-full blur-3xl bg-cyan-400/25 dark:bg-cyan-400/18" />
          <div className="absolute top-40 left-1/2 -translate-x-1/2 h-72 w-[820px] rounded-full blur-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/18 to-emerald-400/20 dark:from-blue-400/16 dark:via-indigo-400/14 dark:to-emerald-400/16" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[760px] rounded-full blur-3xl bg-gradient-to-r from-orange-300/20 via-amber-200/18 to-yellow-200/18 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-emerald-500/10" />

          <div
            className="absolute inset-0 opacity-[0.10] dark:opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <Card
          className="
            relative z-10
            w-full max-w-md
            rounded-3xl
            border border-black/10 dark:border-white/10
            bg-white/85 dark:bg-white/[0.06]
            backdrop-blur-xl
            shadow-[0_20px_80px_-55px_rgba(0,0,0,0.55)]
            text-card-foreground
          "
        >
          <CardHeader className="text-center space-y-2 pt-8">
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-cyan-400 dark:via-blue-400 dark:to-emerald-400">
              Welcome to FixMate
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Sign up to get the best experience
            </p>
          </CardHeader>

          <CardContent className="space-y-5 mt-4 px-6">
            <div className="relative">
              <input
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                type="text"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                First Name
              </label>
            </div>

            <div className="relative">
              <input
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                type="text"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Last Name
              </label>
            </div>

            <div className="relative">
              <input
                value={email}
                onChange={(e) => setemail(e.target.value)}
                type="email"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                type="tel"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Phone Number
              </label>
            </div>

            <div className="relative">
              <input
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                type="password"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Password
              </label>
            </div>

            <div className="relative">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Confirm Password
              </label>
            </div>

            <div className="relative flex items-center justify-between gap-4 pt-1">
              <p className="text-foreground text-sm font-medium">I want to:</p>

              <select
                value={role}
                onChange={(e) => setrole(e.target.value)}
                className="
                  h-11 min-w-[180px] rounded-2xl px-4 outline-none transition
                  bg-white/70 dark:bg-white/[0.06]
                  text-foreground border border-orange-200/60 dark:border-cyan-500/20
                  focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-cyan-500/20
                "
              >
                <option value="" hidden>
                  Select an Option
                </option>
                <option value="CUSTOMER">Hire Services</option>
                <option value="SERVICE_PROVIDER">Provide Services</option>
              </select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-5 mt-4 px-6 pb-8">
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="
                w-full h-12 rounded-2xl font-semibold text-white transition
                bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
                hover:opacity-90
                dark:from-cyan-500 dark:via-blue-500 dark:to-emerald-500
                shadow-lg shadow-orange-500/20 dark:shadow-cyan-500/20
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            {/* <GoogleLoginButton /> */}

            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="cursor-pointer text-orange-500 dark:text-cyan-400 hover:underline font-medium"
              >
                Log in
              </span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}