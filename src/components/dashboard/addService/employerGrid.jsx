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
    hourlyRate: "",
    isFixedPrice: false,
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
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load service categories"));
  }, []);

  /* =======================
     ADD SERVICE
  ======================= */
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

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 auto-rows-fr

"
      >
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
