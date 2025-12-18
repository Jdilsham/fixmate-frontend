import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const response = await axios.post(`${API}/api/auth/login`, {
        email: email,
        password: password,
      });
      localStorage.setItem("token", response.data.token);
      const user = response.data.user;
      console.log("Login successful : ", user);
      // toast.success("Login Successful!");
      navigate("/");
      if (user.isAdmin) {
        // navigate("/admin");
        console.log("Admin logged in");
      } else if (user.isUser) {
        // navigate("/customer");
        console.log("Customer logged in");
      } else if (user.isFacilitator) {
        // navigate("/facilitator");
        console.log("Facilitator logged in");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card
        className="
          relative
          w-105
          rounded-2xl
          bg-card
          text-card-foreground
          border border-border
          shadow-xl
          transition-transform duration-300 ease-out
          hover:scale-[1.018]
        "
      >
        {/* ==== THEME TOGGLE === */}
        <div className="absolute top-4 right-4">
          <motion.button
            layout
            onClick={() => setDark(!dark)}
            className="
              w-15 h-10 rounded-full
              bg-muted
              flex items-center
              px-1
              cursor-pointer
            "
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="
                w-8 h-8 rounded-full
                bg-accent
                flex items-center justify-center
                text-accent-foreground
              "
              style={{
                marginLeft: dark ? "auto" : "0",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.svg
                    key="moon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <path
                      fill="currentColor"
                      d="M21 12.79A9 9 0 0 1 11.21 3
                      A7 7 0 0 0 12 17a7 7 0 0 0 9-4.21Z"
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="sun"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <path
                      fill="currentColor"
                      d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-14v2m0 12v2
                      m8-8h2M2 12H4m12.95-6.95l1.41-1.41
                      M5.64 18.36l1.41-1.41m0-11.31L5.64 5.64
                      m12.72 12.72l-1.41-1.41"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.button>
        </div>

        {/* HEADER */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-semibold">Welcome back</CardTitle>
          <p className="text-muted-foreground text-sm">
            Sign in to continue to FixMate
          </p>
        </CardHeader>

        {/* FORM */}
        <CardContent className="space-y-6 mt-6">
          <div className="relative">
            <input
              type="email"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all">
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all">
              Password
            </label>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" className="peer sr-only" />

              {/* Custom checkbox */}
              <div
                className="
      w-5 h-5
      rounded-md
      border border-border
      flex items-center justify-center
      transition
      peer-checked:bg-accent
      peer-checked:border-accent
    "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="
        w-3.5 h-3.5
        text-accent-foreground
        scale-0
        transition-transform
        peer-checked:scale-100
      "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span className="text-muted-foreground text-sm">Remember me</span>
            </label>

            <a href="/forgetpassword" className="text-accent hover:underline">
              Forgot password?
            </a>
          </div>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex flex-col gap-6 mt-6">
          <button className="w-full h-12 rounded-xl bg-accent text-accent-foreground font-medium hover:brightness-110 transition">
            Sign In
          </button>

          <p className="text-muted-foreground text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-accent hover:underline">
              Create one
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
