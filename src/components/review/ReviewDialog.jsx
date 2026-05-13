import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { createReview } from "../../../utils/profile";

function Stars({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={[
            "p-1.5 rounded-xl transition",
            disabled
              ? "opacity-60"
              : "hover:bg-black/5 dark:hover:bg-white/10",
          ].join(" ")}
          aria-label={`${n} stars`}
        >
          <Star
            className={[
              "h-6 w-6 transition",
              n <= value
                ? "fill-amber-400 text-amber-400"
                : "text-slate-400 dark:text-slate-500",
            ].join(" ")}
          />
        </button>
      ))}

      <span className="ml-2 text-sm text-muted-foreground">
        {value ? `${value}/5` : "Tap to rate"}
      </span>
    </div>
  );
}

export default function ReviewDialog({ open, onClose, booking, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setRating(0);
      setComment("");
      setLoading(false);
    }
  }, [open]);

  const submit = async () => {
    if (!booking?.bookingId) return;
    if (!rating) return toast.error("Please select a rating");
    if (comment.trim().length < 3) return toast.error("Please add a short comment");

    try {
      setLoading(true);
      await createReview({
        bookingId: booking.bookingId,
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted!");
      onClose?.();
      onSubmitted?.();
    } catch (e) {
      toast.error("Failed to submit review");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          p-0 overflow-hidden rounded-3xl
          border border-black/10 dark:border-white/10
          bg-white/80 dark:bg-slate-950/55
          backdrop-blur-xl
          text-foreground
          shadow-[0_24px_80px_-40px_rgba(2,6,23,0.25)]
          dark:shadow-[0_26px_90px_-45px_rgba(34,211,238,0.25)]

          [&>button.absolute]:hidden
        "
      >
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-primary to-cyan-400 dark:from-cyan-400 dark:via-blue-500 dark:to-emerald-400" />

        <DialogHeader className="px-6 pt-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-lg font-semibold">
                Review Provider
              </DialogTitle>

              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {booking?.serviceName} • {booking?.providerName}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              className="
                rounded-full p-2
                border border-black/10 dark:border-white/10
                bg-white/70 hover:bg-white/90
                dark:bg-white/5 dark:hover:bg-white/10
                transition
              "
            >
              <X className="h-4 w-4 text-slate-700 dark:text-slate-200" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <div
            className="
              rounded-2xl p-4
              border border-black/10 dark:border-white/10
              bg-white/60 dark:bg-white/5
            "
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Rating
            </p>
            <Stars value={rating} onChange={setRating} disabled={loading} />
          </div>

          <div
            className="
              rounded-2xl p-4
              border border-black/10 dark:border-white/10
              bg-white/60 dark:bg-white/5
            "
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Comment
            </p>

            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write about your experience..."
              disabled={loading}
              className="
                w-full rounded-2xl px-4 py-3 text-sm
                border border-black/10 dark:border-white/10
                bg-white/80 dark:bg-slate-950/40
                text-foreground
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-primary/30
              "
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="fixmateOutline"
              onClick={onClose}
              disabled={loading}
              className="rounded-full"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="fixmate"
              onClick={submit}
              disabled={loading}
              className="rounded-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}