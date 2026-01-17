import { useNavigate } from "react-router-dom";

export default function PublicServiceCard({ service }) {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[320px] h-[420px] bg-[#2f5d7c] rounded-2xl p-6 flex flex-col text-white shadow-md hover:shadow-xl transition">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
          {service.providerName?.charAt(0) || "?"}
        </div>

        <div>
          <p className="text-base font-semibold">{service.providerName}</p>
          <p className="text-sm opacity-80">{service.categoryName}</p>
        </div>
      </div>

      {/* SERVICE TITLE */}
      <h3 className="text-xl font-bold mb-2">{service.serviceTitle}</h3>

      {/* LOCATION */}
      <p className="text-sm opacity-80 mb-3">
        📍 {service.location}
      </p>

      {/* PRICING */}
      <div className="bg-white/10 rounded-xl p-3 text-sm mb-4 space-y-1">
        <p>
          <span className="opacity-80">Fixed Rate:</span>{" "}
          <span className="font-medium">
            {service.fixedPrice ? `Rs. ${service.fixedPrice}` : "—"}
          </span>
        </p>
        <p>
          <span className="opacity-80">Hourly Rate:</span>{" "}
          <span className="font-medium">
            {service.hourlyRate ? `Rs. ${service.hourlyRate}` : "—"}
          </span>
        </p>
      </div>

      {/* FOOTER */}
      <div className="mt-auto">
        <button
          onClick={() => navigate(`/book/${service.providerServiceId}`)}
          className="w-full py-2.5 rounded-xl bg-orange-500 font-medium text-white hover:bg-orange-600 transition"
        >
          View profile
        </button>
      </div>
    </div>
  );
}
