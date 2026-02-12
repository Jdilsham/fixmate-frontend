// PublicServiceCardSkeleton.jsx
export default function PublicServiceCardSkeleton() {
  return (
    <div
      className="
        w-full max-w-[360px] mx-auto
        rounded-3xl
        border border-white/10
        bg-white/70 dark:bg-white/5
        backdrop-blur
        shadow-lg shadow-black/5
        overflow-hidden
        animate-pulse
      "
    >
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-black/10 dark:bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
            <div className="flex gap-2 pt-1">
              <div className="h-7 w-16 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-7 w-28 rounded-full bg-black/10 dark:bg-white/10" />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-6 w-32 rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-black/10 dark:bg-white/10" />
        </div>

        <div className="mt-5 h-24 rounded-2xl bg-black/10 dark:bg-white/10" />

        <div className="mt-6 h-11 rounded-2xl bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}