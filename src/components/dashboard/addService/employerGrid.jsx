import { useState, useEffect } from "react";
import EmployerCard from "../../ServicesPage/employerCard";
import AddServiceCard from "./addService";
import AddEmployerModal from "./addEmployer";
import toast from "react-hot-toast";
import {
  addProviderService,
  getProviderServiceCategories,
  getProviderServices,
} from "../../../../utils/profile";

export default function EmployerGrid({ profile }) {
  const [services, setServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    serviceId: "",
    description: "",
    fixedPrice: "",
    hourlyRate: "",
  });

  const [pdfFile, setPdfFile] = useState(null);

  /* =======================
     LOAD SERVICES (ONE PLACE)
  ======================= */
  const loadProviderServices = async () => {
    try {
      const data = await getProviderServices();
      setServices(data);
      setProviderServices(data);
    } catch {
      toast.error("Failed to load provider services");
    }
  };

  /* =======================
     LOAD ON PAGE LOAD
  ======================= */
  useEffect(() => {
    loadProviderServices();
  }, []);

  useEffect(() => {
    getProviderServiceCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load service categories"));
  }, []);

  /* =======================
     ADD SERVICE
  ======================= */
  const addService = async (data) => {
    try {
      await addProviderService(
        {
          serviceId: Number(data.serviceId),
          description: data.description,
          fixedPrice: data.fixedPrice ? Number(data.fixedPrice) : null,
          hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : null,
        },
        pdfFile
      );

      toast.success("Service added successfully");

      // ✅ REFRESH LIST IMMEDIATELY
      await loadProviderServices();

      // reset form
      setServiceForm({
        serviceId: "",
        description: "",
        fixedPrice: "",
        hourlyRate: "",
      });
      setPdfFile(null);
      setOpen(false);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add service");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {services.map((s) => (
          <EmployerCard
            key={s.providerServiceId}
            employer={{
              providerServiceId: s.providerServiceId,
              profilePic: profile.profilePicture,
              providerName: profile.fullName,
              serviceTitle: s.serviceTitle,
              categoryName: s.categoryName,
              description: s.description,
              fixedPrice: s.fixedPrice,
              hourlyRate: s.hourlyRate,
              verificationStatus: s.verificationStatus,
            }}
          />
        ))}

        <AddServiceCard onClick={() => setOpen(true)} />
      </div>

      {open && (
        <AddEmployerModal
          profile={profile}
          onClose={() => setOpen(false)}
          onSubmit={addService}
          serviceForm={serviceForm}
          setServiceForm={setServiceForm}
          setPdfFile={setPdfFile}
          categories={categories}
          providerServices={providerServices}
        />
      )}
    </>
  );
}
