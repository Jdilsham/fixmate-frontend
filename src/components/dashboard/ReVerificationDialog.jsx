import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ReVerificationDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-xl"
        onPointerDownOutside={(e) => e.preventDefault()} // ❗ block outside click
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
            Re-verification Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            You are about to <strong>replace previously approved documents</strong>.
          </p>

          <p className="text-yellow-300">
            ⚠️ Once uploaded:
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Your account will be temporarily disabled</li>
              <li>You cannot accept new bookings</li>
              <li>Admin approval will be required again</li>
            </ul>
          </p>

          <p>
            Do you want to continue?
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
            onClick={onConfirm}
          >
            Yes, Upload & Re-verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
