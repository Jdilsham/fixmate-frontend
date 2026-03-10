import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ProviderDetailsModal from "./providerDetailsModal";
import RejectionModal from "./RejectionModal";

const API = import.meta.env.VITE_BACKEND_URL;

export default function PendingProvidersTable() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionId, setRejectionId] = useState(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchPendingProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/admin/providers/pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        throw new Error("failed to fetch pending providers");
      }
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      toast.error("Failed to fetch pending providers");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (providerId) => {
    try {
      const response = await fetch(
        `${API}/api/admin/providers/${providerId}/approve`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.ok) {
        toast.success("Provider approved");
        fetchPendingProviders();
      } else {
        toast.error("Failed to approve provider");
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };
  useEffect(() => {
    fetchPendingProviders();
  }, []);

  if (loading) return <div>Loading pending providers...</div>;

  const handleViewDetails = (id) => {
    setSelectedProviderId(id);
    setIsModalOpen(true);
  };

  const handleReject = async (reason) => {
    try {
      setIsActionLoading(true);
      const response = await fetch(
        `${API}/api/admin/providers/${rejectionId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        },
      );
      if (response.ok) {
        toast.success("Provider rejected");
        setIsRejectionModalOpen(false);
        fetchPendingProviders();
      } else {
        toast.error("Failed to reject provider");
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      <Card className="p-4 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Pending Providers</h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-cyan-400/10 dark:bg-[#0d2a42]">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-cyan-400/10 dark:text-slate-300">
                <th className="px-6 py-4 w-1/4">Name</th>
                <th className="px-6 py-4 w-1/3">Email</th>
                <th className="px-6 py-4 w-1/6">Skill</th>
                <th className="px-6 py-4 w-1/4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-200 hover:bg-slate-100/70 dark:border-cyan-400/10 dark:hover:bg-white/5"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {p.fullName}
                  </td>

                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {p.email}
                  </td>

                  <td className="px-6 py-4 text-slate-700 dark:text-slate-200">
                    {p.skill}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-md bg-slate-600 text-white text-xs hover:bg-slate-700">
                        View
                      </button>

                      <button className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs hover:bg-green-700">
                        Approve
                      </button>

                      <button className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs hover:bg-red-600">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <ProviderDetailsModal
        providerId={selectedProviderId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={handleReject}
        loading={isActionLoading}
      />
    </>
  );
}
