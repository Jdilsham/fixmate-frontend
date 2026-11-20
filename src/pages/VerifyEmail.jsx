import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle,CardContent,CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  function handleVerify() {
    if (code.length !== 6) {
      toast.error("Enter valid 6 digit code");
      return;
    }

    toast.success("Email verified successfully!");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl">

        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-semibold">
            Verify Your Email
          </CardTitle>
          <p className="text-muted-foreground text-sm ">
            Enter the 6 digit code sent to your email.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 mt-10 py-6">
          <input
            type="text"
            maxLength="6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full text-center tracking-[10px] text-2xl h-16 bg-transparent border-b border-border outline-none focus:border-accent transition"
            placeholder="______"
          />

          <Button
            onClick={handleVerify}
            className="w-full text-lg bg-accent text-accent-foreground hover:brightness-110"
          >
            Verify
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 text-sm text-center">
          <button
            onClick={() => toast.success("Code resent!")}
            className="text-accent hover:underline"
          >
            Resend Code
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="text-muted-foreground hover:text-foreground transition"
          >
            Back to SignUp
          </button>
        </CardFooter>

      </Card>
    </div>
  );
}