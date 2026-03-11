import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function RejectionModal({
  isOpen,
  onConfirm,
  onClose,
  loading,
}) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      return toast.error("Please provide a reason for rejection");
    }
    onConfirm(reason);
  };

  useEffect(() => {
    if (!isOpen) {
      setReason("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl dark:border-cyan-400/15 dark:bg-[#0b1724]">
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-primary to-cyan-400" />

        <div className="p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Reject Provider Application
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Please provide a reason for rejection. This will be visible to the
              provider.
            </p>

            <Textarea
              placeholder="e.g., ID documents are blurry, or experience doesn't meet requirements."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px] border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-400 dark:border-cyan-400/20 dark:bg-[#102235] dark:text-white dark:placeholder:text-slate-400 dark:focus-visible:ring-cyan-400"
            />
          </div>

          <DialogFooter className="mt-6 flex-row justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!reason.trim() || loading}
            >
              {loading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}