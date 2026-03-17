export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete Service",
  message = "Are you sure you want to delete this service?",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="
            relative w-full max-w-md
            rounded-3xl
            border border-white/10
            bg-[#163754]/95
            backdrop-blur-xl
            shadow-2xl shadow-black/30
            overflow-hidden
          "
        >
          <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div
                className="
                  shrink-0 w-12 h-12 rounded-2xl
                  bg-red-500/15
                  border border-red-400/20
                  flex items-center justify-center
                  text-red-400 text-xl font-bold
                "
              >
                !
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-300">
                This action will permanently remove the selected service.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="
                  px-5 py-2.5
                  rounded-2xl
                  text-sm font-semibold
                  border border-white/10
                  bg-white/10
                  text-slate-200
                  hover:bg-white/15
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="
                  px-5 py-2.5
                  rounded-2xl
                  text-sm font-semibold
                  bg-red-500 text-white
                  hover:bg-red-600
                  transition
                  shadow-lg shadow-red-900/20
                "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}