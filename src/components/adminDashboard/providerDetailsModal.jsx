import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function ProviderDetailsModal({ providerId, isOpen, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && providerId) {
      fetchDetails();
    }
  }, [isOpen, providerId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE.replace(/\/$/, "")}/api/admin/providers/${providerId}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to load details");
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      toast.error("Could not load provider details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!details && loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Provider Verification Details</DialogTitle>
        </DialogHeader>

        {details && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Full Name</p>
                <p className="text-sm">{details.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Email</p>
                <p className="text-sm">{details.email}</p>
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Professional Background</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Skill / Category</p>
                  <p className="text-sm">{details.skill}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm">{details.experience}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p className="text-sm italic">"{details.description || "No description provided"}"</p>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="font-semibold text-sm">Identity Verification</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">ID Front</p>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                    {details.idFrontUrl ? (
                      <img src={details.idFrontUrl} alt="ID Front" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs">No Image</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">ID Back</p>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                    {details.idBackUrl ? (
                      <img src={details.idBackUrl} alt="ID Back" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs">No Image</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">Work/License PDF</p>
                {details.workPdfUrl ? (
                  <a href={details.workPdfUrl} target="_blank" className="text-sm text-blue-600 underline">
                    View Professional Document
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not provided</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
               <Badge variant={details.isProfileComplete ? "success" : "destructive"}>
                 {details.isProfileComplete ? "Profile Complete" : "Profile Incomplete"}
               </Badge>
               <p className="text-xs text-muted-foreground">Joined: {new Date(details.joinedAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}