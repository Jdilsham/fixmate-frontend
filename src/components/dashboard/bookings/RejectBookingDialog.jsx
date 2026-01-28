import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function RejectBookingDialog({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <textarea
            rows={4}
            placeholder="Enter reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border p-2 text-sm"
          />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={!reason.trim()}
              onClick={() => onConfirm(reason)}
            >
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
