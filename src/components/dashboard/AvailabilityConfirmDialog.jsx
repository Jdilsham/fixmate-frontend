import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AvailabilityConfirmDialog({
  open,
  onClose,
  onConfirm,
  nextState,
}) {
  if (!open) return null;

  const disabling = nextState === false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Card */}
      <div
        className="
          relative w-full max-w-md overflow-hidden
          rounded-2xl border
          bg-white
          shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)]
          dark:bg-[#0b2333]
          dark:border-white/10
          dark:shadow-[0_28px_90px_-40px_rgba(0,0,0,0.75)]
        "
      >
        {/* Top gradient line (FixMate style) */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-400" />

        {/* Soft glow accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl dark:bg-cyan-400/10" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl dark:bg-indigo-400/10" />
        </div>

        <div className="relative p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className={[
                "shrink-0 p-2 rounded-full ring-1",
                disabling
                  ? "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-300 dark:ring-red-400/20"
                  : "bg-green-500/10 text-green-600 ring-green-500/20 dark:text-emerald-300 dark:ring-emerald-400/20",
              ].join(" ")}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {disabling
                  ? "Temporarily disable availability?"
                  : "Re-enable availability?"}
              </h3>
              <p className="text-sm mt-1 text-slate-600 dark:text-white/70">
                This action only affects booking availability.
              </p>
            </div>
          </div>

          {/* Info box */}
          <div
            className="
              rounded-xl border p-4 space-y-2 text-sm
              bg-slate-50/80 border-slate-200
              dark:bg-[#0f2a3a]/70 dark:border-white/10
            "
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-cyan-300" />
              <span className="text-slate-700 dark:text-white/80">
                All your services will be{" "}
                <strong className="text-slate-900 dark:text-white">
                  {disabling ? "temporarily unavailable" : "available again"}
                </strong>
              </span>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-cyan-300" />
              <span className="text-slate-700 dark:text-white/80">
                Customers{" "}
                {disabling
                  ? "won’t be able to see your services"
                  : "can book your services"}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-cyan-300" />
              <span className="text-slate-700 dark:text-white/80">
                You can change this anytime
              </span>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-cyan-300" />
              <span className="text-slate-700 dark:text-white/80">
                <strong className="text-slate-900 dark:text-white">
                  Account approval is not affected
                </strong>
              </span>
            </div>
          </div>

          {/* Actions (DON'T change your button colors) */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="
                rounded-xl
                bg-white/60 hover:bg-white
                dark:bg-white/5 dark:hover:bg-white/10
                dark:border-white/10
              "
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              className={
                disabling
                  ? "bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  : "bg-green-600 hover:bg-green-700 text-white rounded-xl"
              }
            >
              {disabling ? "Disable Availability" : "Enable Availability"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}