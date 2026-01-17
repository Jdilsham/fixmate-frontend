import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import GoogleLoginButton from "@/components/LoginSignup/GoogleLoginButton";
import { jwtDecode } from "jwt-decode";


const API = import.meta.env.VITE_BACKEND_URL;

//Fix for ROLE_ prefix in roles
// const normalizedRole = role.replace("ROLE_", "");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

async function handleLogin() {
  try {
    const response = await axios.post(`${API}/api/auth/login`, {
      email,
      password,
    });

    // const token = response.data;
    const { token } = response.data;
    //  Decode JWT safely
    const decoded = jwtDecode(token);
    const role = decoded.role; // SERVICE_PROVIDER or CUSTOMER

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    toast.success("Login successful!");

    if (role === "SERVICE_PROVIDER") {
      navigate("/provider/dashboard");
    } else {
      navigate("/");
    }

  } catch (error) {
    console.error(error);
    toast.error("Invalid credentials");
  }
}



  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <Card
        className="relative 
        w-105 
        bg-card 
        max-w-md 
        rounded-2xl 
        text-card-foreground
        border border-border
        shadow-xl
        transition-transform duration-300 ease-out
        hover:scale-[1.018] "
      >
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-4xl font-semibold">Welcome back</CardTitle>
          <p className="text-muted-foreground text-sm">
            Sign in to your FixMate account
          </p>
        </CardHeader>

        <CardContent className="space-y-6 mt-6">
          <div className="relative">
            {/* email */}
            <input
              type="email"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              Email
            </label>
          </div>

          <div className="relative">
            {/* password */}
            <input
              type="password"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              Password
            </label>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-accent hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <Button
            onClick={handleLogin}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Login
          </Button>

          {/* TEMPORARILY DISABLED FOR DEPLOYMENT */}
          {/* <GoogleLoginButton /> */}

                  

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-accent font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
