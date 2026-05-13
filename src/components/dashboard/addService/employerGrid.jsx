import { useState, useEffect } from "react";
import EmployerCard from "../../ServicesPage/employerCard";
import AddServiceCard from "./addService";
import AddEmployerModal from "./addEmployer";
import toast from "react-hot-toast";
import {
  addProviderService,
  getProviderServiceCategories,
  getProviderServices,
  getProviderAddress,
  toggleProviderServiceActive,
  getProviderAverageRating,
  deleteProviderService
} from "../../../../utils/profile";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function EmployerGrid({ profile, districts = [] }) {
  const [services, setServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("Not specified");
  const [avgRating, setAvgRating] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    serviceId: "",
    districtId: "",
    description: "",
    hourlyRate: "",
    isFixedPrice: false,
  });

  const [pdfFile, setPdfFile] = useState(null);


  const loadProviderServices = async () => {
    try {
      const data = await getProviderServices();
      setServices(data);
      setProviderServices(data);
    } catch {
      toast.error("Failed to load provider services");
    }
  };

  const handleToggleActive = async (providerServiceId) => {
    setServices((prev) =>
      prev.map((s) =>
        s.providerServiceId === providerServiceId
          ? { ...s, isActive: !s.isActive }
          : s
      )
    );

    try {
      await toggleProviderServiceActive(providerServiceId);
      toast.success("Service status updated");
    } catch (err) {
      toast.error("Failed to update service status");

      setServices((prev) =>
        prev.map((s) =>
          s.providerServiceId === providerServiceId
            ? { ...s, isActive: !s.isActive }
            : s
        )
      );
    }
  };

  const handleDeleteService = (providerServiceId) => {
    setSelectedService(providerServiceId);
    setDeleteOpen(true);
  };

  const confirmDeleteService = async () => {
    try {
      await deleteProviderService(selectedService);

      setServices((prev) =>
        prev.filter((s) => s.providerServiceId !== selectedService)
      );

      setProviderServices((prev) =>
        prev.filter((s) => s.providerServiceId !== selectedService)
      );

      toast.success("Service deleted successfully");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to delete service"
      );
    } finally {
      setDeleteOpen(false);
      setSelectedService(null);
    }
  };

  useEffect(() => {
    loadProviderServices();

    // load provider location
    getProviderAddress()
      .then((addr) => {
        if (addr?.city) {
          setLocation(addr.city);
        }
      })
      .catch(() => {
        setLocation("Not specified");
      });
  }, []);


  useEffect(() => {
    getProviderServiceCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load service categories"));
  }, []);

  const addService = async (payload) => {
    try {
      const formData = new FormData();

      // MUST match @RequestPart("data")
      formData.append("data", JSON.stringify(payload));

      // MUST match @RequestPart("qualificationPdf")
      if (pdfFile) {
        formData.append("qualificationPdf", pdfFile);
      } else {
        formData.append("qualificationPdf", new Blob([]));
      }

      await addProviderService(formData);

      toast.success("Service added successfully");

      await loadProviderServices();

      // reset form
      setServiceForm({
        serviceId: "",
        districtId: "",
        description: "",
        hourlyRate: "",
        isFixedPrice: false,
      });

      setPdfFile(null);
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add service");
    }
  };

  useEffect(() => {
    if (!profile?.id) return;

    (async () => {
      try {
        const avg = await getProviderAverageRating(profile.id);
        setAvgRating(avg);
      } catch (e) {
        setAvgRating(null);
      }
    })();
  }, [profile?.id]);

  return (
    
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">

        {services.map((s) => (
          <EmployerCard
            key={s.providerServiceId}
            employer={{
              providerServiceId: s.providerServiceId,
              providerName: profile.fullName,
              providerProfileImage: profile.profilePicture,
              serviceTitle: s.serviceTitle,
              serviceDescription: s.description,
              fixedPriceAvailable: s.fixedPriceAvailable,
              hourlyRate: s.hourlyRate,
              rating: avgRating,
              location: s.district || "Unknown",
              verificationStatus: s.verificationStatus,
              isActive: s.isActive,
              isProviderView: true,
              showViewProfile: false,
            }}
            onToggleActive={handleToggleActive}
            onDeleteService={handleDeleteService}
          />
        ))}


        <AddServiceCard onClick={() => setOpen(true)} />
      </div>

      {open && (
        <AddEmployerModal
          profile={{
            fullName: profile.fullName,
            location: location,
          }}
          onClose={() => setOpen(false)}
          onSubmit={addService}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          setPdfFile={setPdfFile}
          categories={categories}
          providerServices={providerServices}
          districts={districts}
        />
        
      )}
      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDeleteService}
      />
    </>
  );
}
