export default function ServiceCard({ imgsrc, title }) {
  return (
    <div
      className="
        w-full max-w-[220px]
        mx-auto
        rounded-2xl
        bg-white/70 dark:bg-white/5
        backdrop-blur-md
        border border-black/10 dark:border-white/10
        shadow-sm
        flex flex-col items-center justify-center gap-5
        py-8
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl
      "
    >
      <img src={imgsrc} alt={title} className="w-16 h-16 sm:w-20 sm:h-20" />
      <span className="text-base sm:text-lg font-medium text-center">
        {title}
      </span>
    </div>
  );
}
