import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function ApproveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  providerName = "this provider",
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-cyan-400/20 dark:bg-slate-950">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />
        <div className="rounded-t-3xl border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-6 py-5 dark:border-cyan-400/10 dark:bg-gradient-to-r dark:from-slate-900 dark:via-[#0b2239] dark:to-slate-900">
          <DialogHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-cyan-500/15 dark:ring-1 dark:ring-cyan-400/20">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-cyan-300" />
            </div>

            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Approve Provider
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Are you sure you want to approve{" "}
              <span className="font-semibold text-slate-800 dark:text-cyan-200">
                {providerName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="bg-white px-6 py-5 dark:bg-slate-950">
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-cyan-400/15 dark:bg-cyan-500/8">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-cyan-300" />
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
              This action will mark the provider as approved and allow them to
              continue in the system.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-cyan-400/20 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:via-sky-500 dark:to-teal-500 dark:text-white dark:hover:from-cyan-400 dark:hover:via-sky-400 dark:hover:to-teal-400"
            >
              {loading ? "Approving..." : "Yes, Approve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}