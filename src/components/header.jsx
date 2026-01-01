import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DarkmodeToggle from "./darkmodeToggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [initials, setInitials] = useState("U");

  // 🔥 Fetch user using token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;

        const res = await axios.get(`${API}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;

        // handle different backend casing styles
        const first =
          user.firstName ||
          user.firstname ||
          user.first_name ||
          "";

        const last =
          user.lastName ||
          user.lastname ||
          user.last_name ||
          "";

        const i = ((first[0] || "") + (last[0] || "")).toUpperCase();

        setInitials(i || "U");
      } catch (err) {
        console.error("Could not fetch user", err);
      }
    };

    fetchUser();
  }, [token]);

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
    navigate("/login");
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-semibold text-primary"
        >
          FixMate
        </div>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-8">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <button
                  onClick={() => navigate(link.path)}
                  className="text-base font-medium text-foreground transition-colors hover:text-accent"
                >
                  {link.label}
                </button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="pt-10">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Button
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    className="text-lg font-medium text-left"
                  >
                    {link.label}
                  </Button>
                ))}

                {!isLoggedIn && (
                  <>
                    <Button onClick={() => navigate("/login")}>Login</Button>
                    <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {!isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="hidden sm:inline-flex"
              >
                Login
              </Button>

              <Button
                onClick={() => navigate("/signup")}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Sign up
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DarkmodeToggle />
        </div>
      </div>
    </motion.header>
  );
}
