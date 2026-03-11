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
      <DialogContent className="max-w-md rounded-3xl border overflow-hidden border-slate-200 bg-white p-0 shadow-2xl dark:border-cyan-400/15 dark:bg-[#061a2a]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

        <div className="rounded-t-3xl border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-orange-50 px-6 py-5">
          <DialogHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 dark:bg-emerald-500/15">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-emerald-300" />
            </div>

            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Approve Provider
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to approve{" "}
              <span className="font-semibold">{providerName}</span>?
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/20 dark:bg-amber-500/10">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-300" />
            <p className="text-sm text-slate-700 dark:text-slate-200">
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
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-green-600 text-white hover:bg-green-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
            >
              {loading ? "Approving..." : "Yes, Approve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}