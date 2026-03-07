import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function ServiceRequestDetailModal({
  service,
  isOpen,
  onClose,
  onApprove,
  onReject,
  actionLoading,
}) {
  if (!service) return null;

  const qualificationUrl = service.qualificationDocUrl
    ? `${API}/files/${service.qualificationDocUrl}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Service Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider Info */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Provider Name
              </p>
              <p className="text-sm font-medium">{service.providerName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Email
              </p>
              <p className="text-sm">{service.providerEmail}</p>
            </div>
          </div>

          {/* Service Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Service Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm">{service.serviceTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="text-sm">{service.categoryName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pricing</p>
                <p className="text-sm">
                  {service.isFixedPrice
                    ? "Fixed Price"
                    : `Rs. ${service.hourlyRate ?? "N/A"}/hr`}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">District</p>
                <p className="text-sm">{service.district || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm italic">
                "{service.description || "No description provided"}"
              </p>
            </div>
          </div>

          {/* Qualification Document */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <FileText size={16} />
              Qualification Document
            </h3>
            {qualificationUrl ? (
              <div className="space-y-3">
                <a
                  href={qualificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 underline hover:text-blue-800"
                >
                  <ExternalLink size={14} />
                  Open PDF in New Tab
                </a>
                <div className="border rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={qualificationUrl}
                    className="w-full h-[400px]"
                    title="Qualification Document"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No qualification document provided
              </p>
            )}
          </div>

          {/* Status */}
          <div className="flex justify-between items-center border-t pt-4">
            <Badge
              variant={
                service.verificationStatus === "APPROVED"
                  ? "success"
                  : service.verificationStatus === "REJECTED"
                  ? "destructive"
                  : "secondary"
              }
            >
              {service.verificationStatus}
            </Badge>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {service.verificationStatus === "PENDING" && (
            <>
              <Button
                className="bg-red-500 hover:bg-red-700 text-white"
                onClick={() => onReject(service.providerServiceId)}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Reject"}
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onApprove(service.providerServiceId)}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Approve"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
