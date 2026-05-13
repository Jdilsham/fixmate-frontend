import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ReVerificationDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle
            className="
              flex items-center gap-2
              text-amber-800 dark:text-amber-300
            "
          >
            <AlertTriangle className="w-5 h-5" />
            Re-verification Required
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            You are about to{" "}
            <span className="font-semibold text-foreground">
              replace previously approved documents
            </span>.
          </p>

          {/* WARNING BOX */}
          <div
            className="
              rounded-lg border
              border-amber-300 dark:border-amber-500/30
              bg-amber-50 dark:bg-amber-500/10
              p-4
            "
          >
            <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
              ⚠ Once uploaded:
            </p>

            <ul className="list-disc ml-5 space-y-1 text-amber-700 dark:text-amber-300">
              <li>Your account will be temporarily disabled</li>
              <li>You cannot accept new bookings</li>
              <li>Admin approval will be required again</li>
            </ul>
          </div>

          <p className="text-foreground text-sm">
            Do you want to continue?
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
            onClick={onConfirm}
          >
            Yes, Upload & Re-verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
