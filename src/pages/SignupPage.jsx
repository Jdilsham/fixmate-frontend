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
const API = import.meta.env.VITE_BACKEND_URL;

export default function SignupPage() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [role, setrole] = useState("User");

  const [password, setpassword] = useState("");
  
  const navigate = useNavigate();

  async function handleSignup() {
    try {
      const response = await axios.post(`${API}/api/auth/signup`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password,
        role: role,
      });
      console.log("Signup successful:", response.data);
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response?.data) {
        const errors = error.response.data;

        // If backend sent field errors (object)
        if (typeof errors === "object" && !Array.isArray(errors)) {
          const firstError = Object.values(errors)[0]; // get first message
          toast.error(firstError);
          return;
        }

        // If backend sends a normal error message
        if (errors.message) {
          toast.error(errors.message);
          return;
        }
      }
      toast.error(`Signup failed. please try again.`);
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
        {/* HEADER */}
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold">
            Welcome to Fixmate
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Sign up to get the Best Experience
          </p>
        </CardHeader>

        {/* FORM */}
        <CardContent className="space-y-6 mt-6">
          <div className="relative">
            <input
              onChange={(e) => {
                setfirstName(e.target.value);
              }}
              type="text"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              First Name
            </label>
          </div>
          <div className="relative">
            <input
              onChange={(e) => {
                setlastName(e.target.value);
              }}
              type="text"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              Last Name
            </label>
          </div>
          <div className="relative">
            <input
              onChange={(e) => {
                setemail(e.target.value);
              }}
              type="email"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              Email
            </label>
          </div>
          <div className="relative">
            <input
              onChange={(e) => {
                setphone(e.target.value);
              }}
              type="tel"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              Phone Number
            </label>
          </div>
          <div className="relative">
            <input
              onChange={(e) => {
                setpassword(e.target.value);
              }}
              type="password"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              Password
            </label>
          </div>

          <div className="relative">
            <input
              // onChange={(e) => {
              //   setconfirmpassword(e.target.value);
              // }}
              type="password"
              placeholder=" "
              className="peer w-full h-12 bg-transparent border-b border-border text-foreground outline-none focus:border-accent transition"
            />
            <label
              className="absolute left-0 top-3 text-muted-foreground text-sm peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent transition-all peer-not-placeholder-shown:-top-3
      peer-not-placeholder-shown:text-xs"
            >
              Confirm Password
            </label>
          </div>

          <div className="relative flex items-center justify-between ">
            <div>
              <p className="text-foreground">I want to: </p>
            </div>
            <select
              onChange={(e) => {
                setrole(e.target.value);
              }}
              className="flex items-center gap-2 p-2 focus:accent"
            >
              <option value="" hidden defaultChecked>
                Select an Option
              </option>
              <option value="CUSTOMER" className="text-accent-foreground">
                Hire Services
              </option>
              <option value="SERVICE_PROVIDER" className="text-accent-foreground">
                Provide Services
              </option>
            </select>
          </div>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex flex-col gap-6 mt-6">
          <button
            onClick={handleSignup}
            className="w-full h-12 rounded-xl bg-accent text-accent-foreground font-medium hover:brightness-110 transition"
          >
            Sign In
          </button>

          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-accent hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
