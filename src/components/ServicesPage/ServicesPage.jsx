import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import PublicServiceCard from "./PublicServiceCard";
import PublicServiceCardSkeleton from "./PublicServiceCardSkeleton";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/services`
        );
        setServices(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-semibold text-white mb-8">
        Find professionals
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <PublicServiceCardSkeleton key={i} />
          ))}

        {!loading &&
          services.map((service) => (
            <PublicServiceCard
              key={service.providerServiceId}
              service={service}
            />
          ))}
      </div>
    </div>
  );
}
