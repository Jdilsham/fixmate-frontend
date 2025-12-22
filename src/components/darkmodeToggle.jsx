import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function DarkmodeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <motion.button
      layout
      onClick={() => setDark(!dark)}
      className="w-14 h-8 rounded-full bg-muted flex items-center px-1"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 rounded-full bg-background"
        style={{ marginLeft: dark ? "auto" : "0" }}
      />
    </motion.button>
  );
}
