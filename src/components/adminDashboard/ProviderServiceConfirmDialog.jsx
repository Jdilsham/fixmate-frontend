// [&>button.absolute]:hidden

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";

export default function ProviderServiceConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  mode = "APPROVED",
  serviceTitle = "",
  providerName = "",
}) {
  const isApprove = mode === "APPROVED";

  const title = useMemo(
    () => (isApprove ? "Approve service?" : "Reject service?"),
    [isApprove],
  );

  const description = useMemo(
    () =>
      isApprove
        ? "This service will become available on the platform."
        : "This service will be rejected and remain unavailable.",
    [isApprove],
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          max-w-lg overflow-hidden rounded-3xl border p-0
          bg-white text-slate-900
          shadow-[0_25px_90px_-50px_rgba(15,23,42,0.50)]
          dark:border-white/10 dark:bg-[#071b26] dark:text-white
          dark:shadow-[0_40px_120px_-60px_rgba(34,211,238,0.20)]
          [&>button.absolute]:hidden
        "
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9F67] via-[#FFB37A] to-[#6EE7D8]" />

        <div className="border-b border-black/10 px-7 pb-4 pt-6 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-full
                border border-black/10 bg-white text-slate-600 transition
                hover:bg-slate-50 hover:text-slate-900
                dark:border-white/10 dark:bg-white/5 dark:text-white/70
                dark:hover:bg-white/10 dark:hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-7 py-6">
          <div
            className="
              rounded-2xl border border-black/10 bg-slate-50 px-4 py-4
              dark:border-white/10 dark:bg-white/5
            "
          >
            <p className="text-sm text-slate-600 dark:text-white/60">
              Provider
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
              {providerName || "Unknown provider"}
            </p>

            <p className="mt-4 text-sm text-slate-600 dark:text-white/60">
              Service
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
              {serviceTitle || "Untitled service"}
            </p>
          </div>

          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              isApprove
                ? "border border-green-200 bg-green-50 text-green-800 dark:border-green-300/20 dark:bg-green-400/10 dark:text-green-200"
                : "border border-red-200 bg-red-50 text-red-800 dark:border-red-300/20 dark:bg-red-400/10 dark:text-red-200"
            }`}
          >
            {isApprove
              ? "This action will approve the service and make it visible for platform use."
              : "This action will reject the service submission."}
          </div>
        </div>

        <div className="border-t border-black/10 px-7 py-5 dark:border-white/10">
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="fixmateOutline"
              onClick={onClose}
              className="rounded-full px-6"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-full px-6 disabled:opacity-60 ${
                isApprove
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isApprove ? (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              {loading ? "Please wait..." : isApprove ? "Approve" : "Reject"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
