import { useNavigate } from "react-router-dom";
import Services from "../../pages/services";

export default function EmployerCard({ employer }) {
  const navigate = useNavigate();

  if (!employer) return null;

  const {
    profilePic,
    providerName,
    serviceTitle,
    categoryName,
    description,
    fixedPrice,
    hourlyRate,
    verificationStatus,
    providerServiceId,
    rating,
    location,
  } = employer;

  return (
    <div className="w-full max-w-[320px] h-[420px] bg-[#2f5d7c] rounded-2xl p-6 flex flex-col text-white shadow-md hover:shadow-xl transition">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold overflow-hidden">
          {profilePic ? (
           <img
              src={profilePic?.startsWith("http")
                ? profilePic
                : `${import.meta.env.VITE_BACKEND_URL}${profilePic}`
              }
              alt={providerName}
              className="w-full h-full object-cover"
            />

          ) : (
            <span>{providerName?.charAt(0) || "?"}</span>
          )}
        </div>

        <div>
          <p className="text-base font-semibold">{providerName}</p>
          <p className="text-sm opacity-80">{categoryName}</p>
        </div>
      </div>

      {/* SERVICE TITLE */}
      <h3 className="text-xl font-bold mb-2">{serviceTitle}</h3>

      {/* DESCRIPTION */}
      <p className="text-sm opacity-90 mb-4 ">
        {description}
      </p>

      {/* PRICING */}
      <div className="bg-white/10 rounded-xl p-3 text-sm mb-4 space-y-1">
        <p>
          <span className="opacity-80">Fixed Rate:</span>{" "}
          <span className="font-medium">
            {fixedPrice ? `Rs. ${fixedPrice}` : "—"}
          </span>
        </p>
        <p>
          <span className="opacity-80">Hourly Rate:</span>{" "}
          <span className="font-medium">
            {hourlyRate ? `Rs. ${hourlyRate}` : "—"}
          </span>
        </p>
      </div>

      {/* FOOTER */}
      <div className="mt-auto">
        <div className="flex justify-between ">
          <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3
            ${
              verificationStatus === "APPROVED"
                ? "bg-green-500/20 text-green-300"
                : verificationStatus === "PENDING"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-red-500/20 text-red-300"
            }
          `}
        >
          ★ {rating}
          
        </span>
        <span>
          📍{location}
        </span>
        </div>

        <button
          onClick={() =>
            navigate(`/profile/${providerServiceId}`)
          }
          className="w-full py-2.5 rounded-xl bg-orange-500 font-medium text-white hover:bg-orange-600 transition"
        >
          View profile
        </button>
      </div>
    </div>
  );
}
