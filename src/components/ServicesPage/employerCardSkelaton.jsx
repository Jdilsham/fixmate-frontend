export default function EmployerCardSkeleton() {
  return (
    <div
      className="
        w-full max-w-[360px] mx-auto
        rounded-3xl border border-border/60
        bg-card/80
        p-6
        shadow-sm
        animate-pulse
        overflow-hidden
      "
    >
      <div className="h-16 w-full bg-muted/40 rounded-2xl mb-5" />

      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-muted/50" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-muted/50 rounded" />
          <div className="h-4 w-40 bg-muted/50 rounded" />
          <div className="flex gap-2 pt-1">
            <div className="h-6 w-16 bg-muted/40 rounded-full" />
            <div className="h-6 w-28 bg-muted/40 rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <div className="h-5 w-3/4 bg-muted/50 rounded" />
        <div className="h-4 w-full bg-muted/40 rounded" />
        <div className="h-4 w-5/6 bg-muted/40 rounded" />
      </div>

      <div className="rounded-2xl border bg-muted/30 p-4 mb-5">
        <div className="h-4 w-full bg-muted/40 rounded" />
        <div className="h-4 w-4/5 bg-muted/40 rounded mt-3" />
      </div>

      <div className="h-11 w-full bg-muted/50 rounded-2xl" />
    </div>
  );
}