export default function EmployerCard({ employer }) {
  return (
    <div
      className="
        w-full max-w-[320px]
        h-[400px]
        bg-card
        border border-border
        rounded-2xl
        p-6
        flex flex-col
        transition-shadow duration-300
        hover:shadow-xl
      "
    >
     
      <div className="flex items-center gap-4 h-[72px]">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
          {employer?.name?.charAt(0) || "?"}
        </div>

        <div className="overflow-hidden">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2">
            {employer.name}
          </h3>
          <span className="text-sm text-muted-foreground">
            Verified Professional
          </span>
        </div>
      </div>

      
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed h-[72px] line-clamp-3">
        {employer.description}
      </p>

      <div className="flex-1" />

      
      <div className="h-[96px] flex flex-col justify-between">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>⭐ 4.8</span>
          <span>{employer.location || "Nearby"}</span>
        </div>

        <button
          className="
            w-full
            py-2.5
            rounded-xl
            bg-accent
            text-accent-foreground
            font-medium
            transition
            hover:brightness-110
          "
        >
          View profile
        </button>
      </div>
    </div>
  );
}
