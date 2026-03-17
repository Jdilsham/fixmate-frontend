import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ProviderDetailsModal from "./providerDetailsModal";
import RejectionModal from "./RejectionModal";
import ApproveConfirmationModal from "./ApproveConfirmationModal";
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
} from "../../../utils/admin";

export default function PendingProvidersTable() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rejectionId, setRejectionId] = useState(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const [approveId, setApproveId] = useState(null);
  const [approveName, setApproveName] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchPendingProviders = async () => {
    try {
      setLoading(true);
      const data = await getPendingProviders();
      setProviders(data);
    } catch (error) {
      toast.error("Failed to fetch pending providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const handleViewDetails = (id) => {
    setSelectedProviderId(id);
    setIsModalOpen(true);
  };

  const openApproveModal = (providerId, providerName) => {
    setApproveId(providerId);
    setApproveName(providerName || "this provider");
    setIsApproveModalOpen(true);
  };

  const handleApproval = async () => {
    try {
      setIsActionLoading(true);
      await approveProvider(approveId);
      toast.success("Provider approved");
      setIsApproveModalOpen(false);
      setApproveId(null);
      setApproveName("");
      fetchPendingProviders();
    } catch (error) {
      toast.error("Failed to approve provider");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    try {
      setIsActionLoading(true);
      await rejectProvider(rejectionId, reason);
      toast.success("Provider rejected");
      setIsRejectionModalOpen(false);
      setRejectionId(null);
      fetchPendingProviders();
    } catch (error) {
      toast.error("Failed to reject provider");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return <div>Loading pending providers...</div>;
  }

  return (
    <>
      <Card className="rounded-2xl p-4">
        <h2 className="mb-4 text-lg font-semibold">Pending Providers</h2>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-cyan-400/10 dark:bg-[#0d2a42]">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-cyan-400/10 dark:text-slate-300">
                <th className="w-1/4 px-6 py-4">Name</th>
                <th className="w-1/3 px-6 py-4">Email</th>
                <th className="w-1/6 px-6 py-4">Skill</th>
                <th className="w-1/4 px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((p) => {
                const providerId = p.providerId || p.id;

                return (
                  <tr
                    key={providerId}
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
                        <button
                          onClick={() => handleViewDetails(providerId)}
                          className="rounded-md bg-slate-600 px-3 py-1.5 text-xs text-white hover:bg-slate-700"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            openApproveModal(providerId, p.fullName)
                          }
                          className="rounded-md bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => {
                            setRejectionId(providerId);
                            setIsRejectionModalOpen(true);
                          }}
                          className="rounded-md bg-red-500 px-3 py-1.5 text-xs text-white hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ProviderDetailsModal
        providerId={selectedProviderId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ApproveConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          if (!isActionLoading) {
            setIsApproveModalOpen(false);
            setApproveId(null);
            setApproveName("");
          }
        }}
        onConfirm={handleApproval}
        loading={isActionLoading}
        providerName={approveName}
      />

      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => {
          if (!isActionLoading) {
            setIsRejectionModalOpen(false);
            setRejectionId(null);
          }
        }}
        onConfirm={handleReject}
        loading={isActionLoading}
      />
    </>
  );
}