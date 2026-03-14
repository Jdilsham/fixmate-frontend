import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Briefcase, CheckCircle2, XCircle } from "lucide-react";
import { Eye } from "lucide-react";
import ProviderServiceConfirmDialog from "./ProviderServiceConfirmDialog";
import {
  getPendingProviderServices,
  getProviderServiceDetails,
  verifyProviderService,
} from "../../../utils/admin";
import AdminProviderServiceDetailsDialog from "./AdminProviderServiceDetailsDialog";

export default function PendingProviderServicesTable() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [selectedService, setSelectedService] = useState(null);
  const [confirmMode, setConfirmMode] = useState("APPROVED");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchPendingServices = async () => {
    try {
      setLoading(true);
      const data = await getPendingProviderServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load pending services", error);
      toast.error("Failed to load pending services");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (service, mode) => {
    setSelectedService(service);
    setConfirmMode(mode);
    setIsConfirmOpen(true);
  };

  const openDetailsDialog = async (service) => {
    try {
      setDetailsLoading(true);
      const data = await getProviderServiceDetails(service.providerServiceId);
      setSelectedService(data);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Failed to load provider service details", error);
      toast.error("Failed to load provider service details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedService) return;

    try {
      setActionLoadingId(selectedService.providerServiceId);

      await verifyProviderService(
        selectedService.providerServiceId,
        confirmMode,
      );

      toast.success(
        confirmMode === "APPROVED"
          ? "Service approved successfully"
          : "Service rejected successfully",
      );

      setServices((prev) =>
        prev.filter(
          (item) =>
            item.providerServiceId !== selectedService.providerServiceId,
        ),
      );

      setIsConfirmOpen(false);
      setIsDetailsOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Service verification failed", error);
      const message =
        error?.response?.data || error?.message || "Action failed";
      toast.error(typeof message === "string" ? message : "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchPendingServices();
  }, []);

  return (
    <>
      <Card className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-colors dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)] dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Pending Provider Services</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Review provider-submitted services before making them publicly
              available.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-cyan-400/20 dark:bg-[#0d2a42]">
            <Briefcase
              size={20}
              className="text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-500 transition-colors dark:border-cyan-400/10 dark:bg-[#0d2a42] dark:text-slate-300">
            Loading pending services...
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-500 transition-colors dark:border-cyan-400/10 dark:bg-[#0d2a42] dark:text-slate-300">
            No pending provider services found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 transition-colors dark:border-cyan-400/10 dark:bg-[#0d2a42]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-cyan-400/10 dark:text-slate-300">
                  <th className="px-4 py-4 font-medium">Provider</th>
                  <th className="px-4 py-4 font-medium">Email</th>
                  <th className="px-4 py-4 font-medium">Service</th>
                  <th className="px-4 py-4 font-medium">Category</th>
                  <th className="px-4 py-4 font-medium">District</th>
                  <th className="px-4 py-4 font-medium">Pricing</th>
                  <th className="px-4 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {services.map((item) => (
                  <tr
                    key={item.providerServiceId}
                    className="border-b border-slate-200 transition-colors hover:bg-slate-100/70 dark:border-cyan-400/10 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                      {item.providerName}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {item.providerEmail}
                    </td>

                    <td className="px-4 py-4 text-slate-900 dark:text-white">
                      {item.serviceTitle}
                    </td>

                    <td className="px-4 py-4 text-slate-900 dark:text-white">
                      {item.categoryName}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {item.district || "N/A"}
                    </td>

                    <td className="px-4 py-4 text-slate-900 dark:text-white">
                      {item.isFixedPrice
                        ? "Fixed Price"
                        : `Rs. ${Number(item.hourlyRate || 0).toLocaleString()}/hr`}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => openDetailsDialog(item)}
                          disabled={actionLoadingId === item.providerServiceId}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          className="rounded-full bg-green-600 text-white hover:bg-green-700"
                          onClick={() => openConfirmDialog(item, "APPROVED")}
                          disabled={actionLoadingId === item.providerServiceId}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>

                        <Button
                          className="rounded-full bg-red-500 text-white hover:bg-red-600"
                          onClick={() => openConfirmDialog(item, "REJECTED")}
                          disabled={actionLoadingId === item.providerServiceId}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ProviderServiceConfirmDialog
        open={isConfirmOpen}
        onClose={() => {
          if (actionLoadingId) return;
          setIsConfirmOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleVerify}
        loading={actionLoadingId === selectedService?.providerServiceId}
        mode={confirmMode}
        serviceTitle={selectedService?.serviceTitle || ""}
        providerName={selectedService?.providerName || ""}
      />
      <AdminProviderServiceDetailsDialog
        open={isDetailsOpen}
        onClose={() => {
          if (actionLoadingId || detailsLoading) return;
          setIsDetailsOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        loading={actionLoadingId === selectedService?.providerServiceId}
        onApprove={() => {
          setIsDetailsOpen(false);
          openConfirmDialog(selectedService, "APPROVED");
        }}
        onReject={() => {
          setIsDetailsOpen(false);
          openConfirmDialog(selectedService, "REJECTED");
        }}
      />
    </>
  );
}
