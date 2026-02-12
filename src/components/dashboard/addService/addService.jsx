export default function AddServiceCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full max-w-[360px] mx-auto
        min-h-[380px]
        rounded-3xl
        border border-white/10
        bg-white/40 dark:bg-white/5
        backdrop-blur
        shadow-lg shadow-black/5
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        flex items-center justify-center
        text-left
      "
    >
      <div className="flex flex-col items-center text-center px-6">
        {/* Icon */}
        <div
          className="
            w-16 h-16 rounded-2xl
            bg-slate-900/5 dark:bg-white/10
            ring-1 ring-black/5 dark:ring-white/10
            flex items-center justify-center
            transition-transform duration-300
            group-hover:scale-110
          "
        >
          <span className="text-3xl font-semibold text-slate-700 dark:text-slate-200">
            +
          </span>
        </div>

        {/* Title */}
        <p className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
          Add new service
        </p>

        {/* Subtitle */}
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create a new service category, add description, pricing and upload verification PDF.
        </p>

        {/* Hint chip */}
        <div
          className="
            mt-5 inline-flex items-center gap-2
            px-3 py-1.5 rounded-full
            text-xs font-medium
            bg-slate-900/5 text-slate-700
            dark:bg-white/10 dark:text-slate-200
          "
        >
          <span className="text-emerald-500">●</span>
          Click to open form
        </div>
      </div>
    </button>
  );
}