import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ServiceRequestDetailModal from "./ServiceRequestDetailModal";

const API = import.meta.env.VITE_BACKEND_URL;

export default function ServiceRequestsTable() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/admin/provider-services/pending`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch pending service requests");
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      toast.error("Failed to fetch service requests");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${API}/api/admin/provider-services/${id}/verify?status=${status}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.ok) {
        toast.success(
          status === "APPROVED"
            ? "Service approved successfully"
            : "Service rejected"
        );
        setIsModalOpen(false);
        setSelectedService(null);
        fetchPendingServices();
      } else {
        toast.error(`Failed to ${status.toLowerCase()} service`);
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = (id) => handleVerify(id, "APPROVED");
  const handleReject = (id) => handleVerify(id, "REJECTED");

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchPendingServices();
  }, []);

  if (loading) return <div>Loading service requests...</div>;

  return (
    <>
      <Card className="p-4 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">
          Pending Service Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Provider</th>
                <th>Email</th>
                <th>Service</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-muted-foreground"
                  >
                    No pending service requests
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service.providerServiceId}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3">{service.providerName}</td>
                    <td className="py-3">{service.providerEmail}</td>
                    <td className="py-3">{service.serviceTitle}</td>
                    <td className="py-3">{service.categoryName}</td>
                    <td className="py-3">
                      <Badge variant="secondary">
                        {service.verificationStatus}
                      </Badge>
                    </td>
                    <td className="py-3 space-x-2 flex items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(service)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(service.providerServiceId)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-400 hover:bg-red-700 text-white"
                        onClick={() => handleReject(service.providerServiceId)}
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

      <ServiceRequestDetailModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </>
  );
}
