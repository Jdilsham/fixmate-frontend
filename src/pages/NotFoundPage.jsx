import { useNavigate } from "react-router-dom";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-center">
      <PageBackground />

      <div className="relative z-10 max-w-xl">
        <h1 className="
          text-7xl font-bold 
          text-transparent bg-clip-text 
          bg-gradient-to-r 
          from-orange-500 via-amber-500 to-orange-600
          dark:from-cyan-400 dark:via-blue-400 dark:to-emerald-400
        ">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or the link is broken.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="fixmate"
            onClick={() => navigate("/")}
            className="rounded-2xl"
          >
            Go Home
          </Button>

          <Button
            variant="fixmateOutline"
            onClick={() => navigate(-1)}
            className="rounded-2xl"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}