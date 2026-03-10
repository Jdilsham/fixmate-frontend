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
      <DialogContent className="max-w-4xl bg-[#071c2c] border border-cyan-400/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Provider Verification Details
          </DialogTitle>
        </DialogHeader>

        {details && (
          <div className="space-y-6">
            {/* PERSONAL INFO */}
            <div className="rounded-xl bg-[#0d2a42] p-4 border border-cyan-400/10">
              <h3 className="font-semibold mb-3">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Full Name</p>
                  <p className="font-medium">{details.fullName}</p>
                </div>

                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="font-medium">{details.email}</p>
                </div>

                <div>
                  <p className="text-slate-400">Skill</p>
                  <p className="font-medium">{details.skill}</p>
                </div>

                <div>
                  <p className="text-slate-400">Experience</p>
                  <p className="font-medium">{details.experience}</p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="rounded-xl bg-[#0d2a42] p-4 border border-cyan-400/10">
              <h3 className="font-semibold mb-2">Description</h3>

              <p className="text-sm text-slate-300 italic">
                {details.description || "No description provided"}
              </p>
            </div>

            {/* DOCUMENTS */}
            <div className="rounded-xl bg-[#0d2a42] p-4 border border-cyan-400/10">
              <h3 className="font-semibold mb-3">Verification Documents</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* ID FRONT */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">ID Front</p>

                  <div className="aspect-video rounded-lg overflow-hidden border border-cyan-400/10 bg-black">
                    {details.idFrontUrl ? (
                      <img
                        src={details.idFrontUrl}
                        alt="ID Front"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                {/* ID BACK */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">ID Back</p>

                  <div className="aspect-video rounded-lg overflow-hidden border border-cyan-400/10 bg-black">
                    {details.idBackUrl ? (
                      <img
                        src={details.idBackUrl}
                        alt="ID Back"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* PDF */}
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">
                  Professional License / Work Document
                </p>

                {details.workPdfUrl ? (
                  <a
                    href={details.workPdfUrl}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    View PDF Document
                  </a>
                ) : (
                  <p className="text-sm text-slate-400">Not provided</p>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className="flex justify-between items-center">
              <Badge
                className={
                  details.isProfileComplete
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }
              >
                {details.isProfileComplete
                  ? "Profile Complete"
                  : "Profile Incomplete"}
              </Badge>

              <p className="text-xs text-slate-400">
                Joined: {new Date(details.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
