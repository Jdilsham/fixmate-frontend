import { Button } from "@/components/ui/button";

export default function ActivateAccountModal({
  open,
  onClose,
  children,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* Modal */}
      <div
        className="
          relative
          w-full max-w-xl
          rounded-3xl
          bg-card border
          shadow-2xl
          animate-in fade-in zoom-in-95
        "
      >
        {/* Close button (top-right, hoverable) */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="
            absolute top-4 right-4
            w-9 h-9
            flex items-center justify-center
            rounded-full
            text-muted-foreground
            hover:bg-muted
            hover:bg-red-500
            transition
          "
        >
          ✕
        </button>

        {/* Header (CENTERED) */}
        <div className="px-6 pt-8 pb-4 text-center border-b">
          <h2 className="text-xl font-semibold">
            Activate Your Account
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete verification to start receiving jobs
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
