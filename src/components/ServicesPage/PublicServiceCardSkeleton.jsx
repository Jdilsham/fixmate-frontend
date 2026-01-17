export default function PublicServiceCardSkeleton() {
  return (
    <div className="w-full max-w-[320px] h-[420px] bg-white/10 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-white/20" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/20 rounded w-3/4" />
          <div className="h-3 bg-white/20 rounded w-1/2" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-4 bg-white/20 rounded" />
        <div className="h-4 bg-white/20 rounded w-5/6" />
      </div>

      <div className="h-12 bg-white/20 rounded-xl mt-auto" />
    </div>
  );
}
