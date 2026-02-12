import { BubbleBackground } from "./bubble";

export default function PageBackground({
  opacity = "opacity-12",
  interactive = false,
}) {
  return (
    <BubbleBackground
      className={`absolute inset-0 -z-10 ${opacity} blur-[1px]`}
      interactive={interactive}
      colors={{
        first: "255, 159, 67",   // FixMate orange
        second: "37, 99, 235",   // Trust blue
        third: "34, 211, 238",   // Soft cyan
        fourth: "99, 102, 241",  // Indigo depth
      }}
    />
  );
}