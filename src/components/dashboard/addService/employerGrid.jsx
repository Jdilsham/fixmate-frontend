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
  toggleProviderServiceActive
} from "../../../../utils/profile";

export default function EmployerGrid({ profile }) {
  const [services, setServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState("Not specified");
  console.log("PROVIDER PROFILE:", profile);

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

  const handleToggleActive = async (providerServiceId) => {
  // optimistic UI update
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

    // rollback if failed
    setServices((prev) =>
      prev.map((s) =>
        s.providerServiceId === providerServiceId
          ? { ...s, isActive: !s.isActive }
          : s
      )
    );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">

        {services.map((s) => (
          <EmployerCard
            key={s.providerServiceId}
            employer={{
              providerServiceId: s.providerServiceId,

              // provider info
              providerName: profile.fullName,
              providerProfileImage: profile.profilePicture,

              // service info
              serviceTitle: s.serviceTitle,
              serviceDescription: s.description,
              fixedPriceAvailable: s.fixedPriceAvailable,
              hourlyRate: s.hourlyRate,

              // meta
              rating: null,
              location: location,

              //PROVIDER-ONLY
              verificationStatus: s.verificationStatus,
              isActive: s.isActive,
              isProviderView: true,      
              showViewProfile: false,   
            }}
             onToggleActive={handleToggleActive}
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
        />
      )}
    </>
  );
}
