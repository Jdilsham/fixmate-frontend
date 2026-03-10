// [&>button.absolute]:hidden

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { X, Ban, CheckCircle2 } from "lucide-react";

export default function BanUserConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  userName = "",
  isBanned = false,
}) {
  const title = useMemo(
    () => (isBanned ? "Unban user?" : "Ban user?"),
    [isBanned]
  );

  const description = useMemo(
    () =>
      isBanned
        ? "This will restore the user's access to the platform."
        : "This will block the user from accessing the platform.",
    [isBanned]
  );

  const actionText = useMemo(
    () => (isBanned ? "Unban User" : "Ban User"),
    [isBanned]
  );

  const actionIcon = isBanned ? (
    <CheckCircle2 className="h-4 w-4" />
  ) : (
    <Ban className="h-4 w-4" />
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
              Selected user
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
              {userName || "Unknown user"}
            </p>
          </div>

          <div
            className={`
              rounded-2xl px-4 py-3 text-sm
              ${
                isBanned
                  ? "border border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-200"
                  : "border border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-300/20 dark:bg-orange-400/10 dark:text-orange-200"
              }
            `}
          >
            {isBanned
              ? "This action will allow the user to use the platform again."
              : "This action will restrict the user account until you unban it."}
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
              variant="fixmate"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-full px-6 disabled:opacity-60"
            >
              <span className="mr-2">{actionIcon}</span>
              {loading ? "Please wait..." : actionText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}