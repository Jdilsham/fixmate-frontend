export default function EmployerCardSkeleton() {
  return (
    <div
      className="
        w-full max-w-[320px]
  min-h-[360px]
        bg-white/50 dark:bg-white/5
        rounded-2xl
        p-6
        animate-pulse
      "
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-black/10 dark:bg-white/10" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-1/2" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-3 bg-black/10 dark:bg-white/10 rounded" />
        <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-5/6" />
      </div>

      <div className="h-10 bg-black/10 dark:bg-white/10 rounded-xl" />
    </div>
  );
}
