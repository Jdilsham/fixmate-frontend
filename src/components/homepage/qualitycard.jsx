export default function QualityCard({ imgsrc, title, description }) {
  return (
    <div
      className="
        group
        relative
        w-full max-w-[360px]
        mx-auto
        rounded-2xl
        bg-white/70 dark:bg-white/5
        backdrop-blur-md
        border border-black/10 dark:border-white/10
        shadow-md
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl
        overflow-hidden
      "
    >
      <div
        className="
          absolute top-0 left-0
          h-[2px]
          w-0
          group-hover:w-full
          transition-all duration-500
          bg-gradient-to-r
          from-accent/70
          via-primary/60
          to-transparent
        "
      />

      <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10 gap-4">
        <img src={imgsrc} alt="" className="w-20 h-20 sm:w-24 sm:h-24" />

        <h3 className="text-lg sm:text-xl font-semibold">
          {title}
        </h3>

        <p className="text-sm sm:text-base opacity-75 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}