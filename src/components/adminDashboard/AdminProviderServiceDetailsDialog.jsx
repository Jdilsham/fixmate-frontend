import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildAdminAssetUrl } from "../../../utils/admin";

const safeText = (value) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "N/A";
  }
  return String(value);
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return `Rs. ${Number(value).toLocaleString()}`;
};

const getPricingType = (service) => {
  if (!service) return "N/A";
  return service.isFixedPrice ? "Fixed Price" : "Hourly Rate";
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-400/20";
    case "REJECTED":
      return "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-400/20";
    default:
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/20";
  }
};

export default function AdminProviderServiceDetailsDialog({
  open,
  onClose,
  service,
  onApprove,
  onReject,
  loading = false,
}) {
  if (!service) return null;

  const docUrl = buildAdminAssetUrl(service.qualificationDocUrl);

  return (
    <Dialog open={open} onOpenChange={onClose}>
        
      <DialogContent className="max-w-3xl rounded-3xl border overflow-hidden border-slate-200 bg-white p-0 dark:border-cyan-400/20 dark:bg-[#071c2c] dark:text-white">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-cyan-400/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Provider Service Details
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Provider Service ID
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {safeText(service.providerServiceId)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Verification Status
            </p>
            <div className="mt-1">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                  service.verificationStatus
                )}`}
              >
                {safeText(service.verificationStatus)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Provider Name
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {safeText(service.providerName)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Provider Email
            </p>
            <p className="mt-1 break-all text-sm text-slate-900 dark:text-white">
              {safeText(service.providerEmail)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Service Title
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {safeText(service.serviceTitle)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Category Name
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {safeText(service.categoryName)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              District
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {safeText(service.district)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Pricing Type
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {getPricingType(service)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Hourly Rate
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {formatMoney(service.hourlyRate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Is Fixed Price
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-white">
              {service.isFixedPrice ? "Yes" : "No"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Description
            </p>
            <div className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 dark:border-cyan-400/10 dark:bg-[#0d2a42] dark:text-white">
              {safeText(service.description)}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Qualification Document
            </p>

            {docUrl ? (
              <a
                href={docUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex text-sm font-medium text-cyan-600 underline dark:text-cyan-300"
              >
                Open Qualification Document
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-900 dark:text-white">
                No document uploaded
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end dark:border-cyan-400/10">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="rounded-full"
          >
            Close
          </Button>

          <Button
            onClick={onApprove}
            disabled={loading}
            className="rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            Approve
          </Button>

          <Button
            onClick={onReject}
            disabled={loading}
            className="rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}