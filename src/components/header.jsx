import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import DarkmodeToggle from "./darkmodeToggle";
import { Menu, Wrench, LayoutDashboard, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getUserProfile } from "../../utils/profile";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);

  const isAdmin = role === "ADMIN";
  const dashboardPath = isAdmin ? "/admin/dashboard" : "/provider/dashboard";

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!isLoggedIn) {
        setProfile(null);
        setRole(null);
        return;
      }

      try {
        const p = await getUserProfile();

        if (alive) {
          setProfile(p);
          setRole(p?.role?.toUpperCase() || null);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        if (alive) {
          setProfile(null);
          setRole(null);
        }
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [isLoggedIn, token, location.pathname]);

  const fullName =
    profile?.fullName ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    "User";

  const initials = (fullName?.trim()?.[0] || "U").toUpperCase();
  const profileSrc = profile?.profilePicture || "";

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Wanted", path: "/wanted" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("dashboardActiveTab");
    localStorage.removeItem("adminActiveTab");
    navigate("/login");
  }

  function goToDashboard() {
    if (isAdmin) {
      localStorage.setItem("adminActiveTab", "dashboard");
    } else {
      localStorage.setItem("dashboardActiveTab", "dashboard");
    }

    navigate(dashboardPath);
  }

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="relative mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6">
          <div className="flex flex-1 items-center">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-accent/40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition group-hover:scale-[1.02]">
                <Wrench className="h-5 w-5" />
              </span>

              <div className="text-left leading-tight">
                <div className="text-xl font-semibold tracking-tight">
                  Fix<span className="text-primary">Mate</span>
                </div>
                <div className="hidden text-[12px] text-muted-foreground sm:block">
                  Fast • Verified • Reliable
                </div>
              </div>
            </button>
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className={[
                        "relative rounded-xl px-4 py-2 text-sm font-medium transition",
                        "text-foreground/80 hover:bg-accent/40 hover:text-foreground",
                        isActive(link.path) ? "bg-accent/35 text-foreground" : "",
                      ].join(" ")}
                    >
                      {link.label}
                      {isActive(link.path) && (
                        <span className="absolute left-3 right-3 -bottom-[6px] h-[2px] rounded-full bg-primary" />
                      )}
                    </button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="pt-10">
                <div className="flex flex-col gap-2">
                  <div className="mb-2 text-sm font-semibold text-muted-foreground">
                    Navigation
                  </div>

                  {navLinks.map((link) => (
                    <Button
                      key={link.label}
                      variant={isActive(link.path) ? "secondary" : "ghost"}
                      onClick={() => navigate(link.path)}
                      className="justify-start rounded-xl"
                    >
                      {link.label}
                    </Button>
                  ))}

                  <div className="my-4 h-px bg-border" />

                  {!isLoggedIn ? (
                    <div className="grid gap-2">
                      <Button onClick={() => navigate("/login")} variant="secondary">
                        Login
                      </Button>
                      <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                    </div>
                  ) : (
                    <Button onClick={goToDashboard} variant="secondary">
                      Go to Dashboard
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="hidden rounded-xl sm:inline-flex"
                >
                  Login
                </Button>

                <Button onClick={() => navigate("/signup")} className="rounded-xl">
                  Sign up
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="
                      relative flex h-10 w-10 items-center justify-center
                      overflow-hidden rounded-full border border-border/60
                      bg-muted transition hover:scale-[1.04]
                      focus:outline-none focus:ring-2 focus:ring-ring/60
                    "
                  >
                    <Avatar.Root className="h-full w-full overflow-hidden rounded-full">
                      <Avatar.Image
                        src={profileSrc}
                        alt="Profile"
                        className="h-full w-full object-cover object-center"
                      />
                      <Avatar.Fallback
                        className="
                          flex h-full w-full items-center justify-center
                          bg-primary/20 text-sm font-semibold text-foreground
                        "
                      >
                        {initials}
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur"
                >
                  <div className="px-2 py-2">
                    <div className="text-sm font-semibold leading-none">Account</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Manage your profile & settings
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    onClick={goToDashboard}
                    className="cursor-pointer rounded-xl px-3 py-2 focus:bg-accent/50"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-xl px-3 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DarkmodeToggle />
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </div>
    </motion.header>
  );
}