export default function ServiceCard({ imgsrc, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group
        relative
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
        cursor-pointer
        overflow-hidden
      "
    >
      <div
        className="
          absolute top-0 left-0
          h-[3px]
          w-0
          group-hover:w-full
          transition-all duration-500
          bg-gradient-to-r
          from-accent/70
          via-primary/60
          to-transparent
        "
      />

      <img
        src={imgsrc}
        alt={title}
        className="w-16 h-16 sm:w-20 sm:h-20"
      />

      <span className="text-base sm:text-lg font-medium text-center">
        {title}
      </span>
    </div>
  );
}