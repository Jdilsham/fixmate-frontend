import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function DarkmodeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <motion.button
      layout
      onClick={() => setDark(!dark)}
      aria-label="Toggle dark mode"
      className={[
        "relative inline-flex items-center",
        "h-9 w-[62px] rounded-full px-1.5",
        "transition-colors",
        "bg-slate-200/80 border border-slate-300/70",
        "shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55)]",
        "dark:bg-white/10 dark:border-white/15",
        "dark:shadow-[0_14px_30px_-18px_rgba(34,211,238,0.35)]",
        "focus:outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2 focus:ring-offset-background",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
        <Sun className="h-4 w-4 text-slate-600 dark:text-white/55" />
        <Moon className="h-4 w-4 text-slate-600 dark:text-white/55" />
      </div>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
        className={[
          "relative z-10 h-7 w-7 rounded-full",
          "bg-white border border-slate-300/70",
          "shadow-[0_10px_20px_-10px_rgba(15,23,42,0.55)]",
          "dark:bg-slate-950 dark:border-white/10",
          "dark:shadow-[0_18px_34px_-16px_rgba(0,0,0,0.85)]",
        ].join(" ")}
        style={{ marginLeft: dark ? "auto" : "0" }}
      />

      <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 dark:opacity-100">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-teal-400/10" />
      </div>
    </motion.button>
  );
}