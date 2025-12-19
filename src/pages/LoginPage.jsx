import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import DarkMode from "../components/darkmodeToggle";

const API = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const response = await axios.post(`${API}/api/auth/login`, {
        email: username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card
        className="relative w-105 bg-card max-w-md shadow-xl rounded-2xl text-card-foreground
          border border-border
          shadow-xl
          transition-transform duration-300 ease-out
          hover:scale-[1.018] "
      >
        <DarkMode />
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-4xl font-semibold">Welcome back</CardTitle>
          <p className="text-muted-foreground text-sm">
            Sign in to your FixMate account
          </p>
        </CardHeader>

        <CardContent className="space-y-6 mt-6">
          <div className="relative">
            
            <input
              id="email"
              type="email"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
