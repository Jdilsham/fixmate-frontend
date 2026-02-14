import { BubbleBackground } from "./bubble";
import { useTheme } from "../../../../context/ThemeContext"; 

export default function PageBackground({ interactive = false }) {
  const { dark } = useTheme();

  const light = {
    opacity: "opacity-12",
    blur: "blur-[1px]",
    colors: {
      first: "255, 159, 67",  // orange
      second: "37, 99, 235",  // blue
      third: "34, 211, 238",  // cyan
      fourth: "99, 102, 241", // indigo
    },
  };

  // Dark mode: deeper + calmer colors (less “neon”), better balance
  const darkSet = {
    opacity: "opacity-[0.10]",     // lower intensity
    blur: "blur-[2px]",            // softer
    colors: {
      first: "255, 124, 58",   // warm orange highlight
      second: "56, 189, 248",  // sky (soft)
      third: "99, 102, 241",   // indigo
      fourth: "16, 185, 129",  // emerald accent (subtle)
    },
  };

  const cfg = dark ? darkSet : light;

  return (
    <div className="absolute inset-0 -z-10">
      {/* Base background layer (important for dark mode depth) */}
      <div className={`absolute inset-0 ${dark ? "bg-[#071A2D]" : "bg-background"}`} />

      {/* Bubble layer */}
      <BubbleBackground
        className={`absolute inset-0 ${cfg.opacity} ${cfg.blur}`}
        interactive={interactive}
        colors={cfg.colors}
      />

      {/* Dark overlay to improve readability */}
      {dark && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#061426]/70 via-[#061426]/35 to-[#061426]/80" />
      )}
    </div>
  );
}