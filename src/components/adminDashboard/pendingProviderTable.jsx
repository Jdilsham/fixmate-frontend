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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b ">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Skill</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-muted-foreground"
                  >
                    No pending providers
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr
                    key={provider.providerId}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3">
                      {provider.firstName} {provider.lastName}
                    </td>
                    <td className="py-3">{provider.email}</td>
                    <td className="py-3">{provider.skill || "N/A"}</td>
                    <td className="py-3 text-right space-x-2 flex items-center justify-center">
                      <Button
                        onClick={() => handleViewDetails(provider.providerId)}
                      >
                        View
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproval(provider.providerId)}
                      >
                        Approve
                      </Button>
                      <Button
                        className="bg-red-400 hover:bg-red-700"
                        onClick={() => {
                          setRejectionId(provider.providerId);
                          setIsRejectionModalOpen(true);
                        }}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))
              )}
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
