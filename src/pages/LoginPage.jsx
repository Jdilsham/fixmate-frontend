import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";
import { jwtDecode } from "jwt-decode";
// import GoogleLoginButton from "@/components/LoginSignup/GoogleLoginButton";

const API = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const GLASS =
    "backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_20px_80px_-55px_rgba(0,0,0,0.55)]";

  const SURFACE = `bg-white/85 dark:bg-white/[0.06] ${GLASS}`;

  async function handleLogin() {
    try {
      const response = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;
      const decoded = jwtDecode(token);
      const role = decoded.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Login successful!");

      if (role === "SERVICE_PROVIDER") {
        navigate("/provider/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
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

        <Card className={`relative z-10 w-full max-w-md rounded-3xl ${SURFACE}`}>
          <CardHeader className="space-y-2 text-center pt-8">
            <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-cyan-400 dark:via-blue-400 dark:to-emerald-400">
              Welcome back
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Sign in to your FixMate account
            </p>
          </CardHeader>

          <CardContent className="space-y-6 mt-4 px-6 pb-8">
            <div className="relative">
              <input
                type="email"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder=" "
                className="peer w-full h-12 bg-transparent border-0 border-b border-slate-300 dark:border-white/15 text-foreground outline-none focus:border-orange-500 dark:focus:border-cyan-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-orange-500 dark:peer-focus:text-cyan-400 transition-all peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:text-xs">
                Password
              </label>
            </div>

            <div className="flex items-center justify-between text-sm gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-muted-foreground">
                  Remember me
                </Label>
              </div>

              <button
                onClick={() => navigate("/forgot-password")}
                className="text-orange-500 dark:text-cyan-400 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="
                w-full h-12 rounded-2xl font-semibold text-white transition
                bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
                hover:opacity-90
                dark:from-cyan-500 dark:via-blue-500 dark:to-emerald-500
                shadow-lg shadow-orange-500/20 dark:shadow-cyan-500/20
              "
            >
              Login
            </button>

            {/* <GoogleLoginButton /> */}

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-orange-500 dark:text-cyan-400 font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}