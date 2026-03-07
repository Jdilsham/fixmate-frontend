import { useState } from "react";

export default function SmartBookingModal({ open, onClose }) {
  const [pricingType, setPricingType] = useState("HOURLY");

  if (!open) return null;

  const explanation =
    pricingType === "HOURLY"
      ? "FixMate first looks for nearby available providers for the selected service. Then it compares hourly rates among the nearest matching providers and automatically assigns the best option."
      : "FixMate finds available verified providers for the selected service and automatically assigns the nearest matching provider.";

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-semibold">Smart Booking</h2>
            <p className="text-sm text-white/60">
              Let FixMate choose the best provider automatically
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 p-6">
          {/* LEFT PANEL */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#12314e] p-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-xl">
                  ⚡
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Auto Match Booking</h3>
                  <p className="text-sm text-white/70">
                    Best provider selected automatically
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">
                  Booking mode
                </p>
                <p className="mt-2 text-3xl font-bold text-orange-400">
                  {pricingType}
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Smart provider selection enabled
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Selection Rule</span>
                  <span className="text-emerald-400 font-medium">Automatic</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Provider Type</span>
                  <span className="text-white/90">Verified & Available</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/70">Priority</span>
                  <span className="text-white/90">
                    {pricingType === "HOURLY" ? "Nearest + Hourly" : "Nearest"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0f2a41] p-5">
              <h3 className="text-sm font-semibold text-cyan-300">How smart booking works</h3>
              <p className="mt-3 text-sm leading-6 text-white/75">
                {explanation}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0f2a41] p-5">
              <h3 className="text-sm font-semibold text-white/90">Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/70 list-disc list-inside">
                <li>Select the required service type.</li>
                <li>Pick your exact location on the map.</li>
                <li>Choose the booking date and time carefully.</li>
                <li>Review the summary before final confirmation.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="rounded-3xl border border-white/10 bg-[#12314e] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Booking Details
                </h3>
                <p className="mt-1 text-sm text-white/65">
                  Fill your details and let FixMate select the right provider.
                </p>
              </div>

              <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/70">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Secure booking
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-10 text-center text-white/50">
              Smart booking form fields will go here
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}