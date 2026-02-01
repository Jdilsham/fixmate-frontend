import { useNavigate } from "react-router-dom";

export default function EmployerCard({ employer, onToggleActive }) {
  const navigate = useNavigate();
  if (!employer) return null;

  const {
    providerServiceId,
    providerName,
    providerProfileImage,
    serviceTitle,
    serviceDescription,
    fixedPriceAvailable,
    hourlyRate,
    rating,
    location,

    // provider-only
    verificationStatus,
    isActive,

    // controls
    showViewProfile = true,
    isProviderView = false,
  } = employer;

  return (
    <div
      className="
        relative
        w-full max-w-[320px] mx-auto
        min-h-[440px]
        rounded-3xl
        p-6
        flex flex-col
        text-white
        bg-gradient-to-br from-[#2f5d7c] via-[#2a5876] to-[#244e69]
        shadow-xl
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20">
          {providerProfileImage ? (
            <img
              src={
                providerProfileImage.startsWith("http")
                  ? providerProfileImage
                  : `${import.meta.env.VITE_BACKEND_URL}${providerProfileImage}`
              }
              alt={providerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/20 flex items-center justify-center font-semibold">
              {providerName?.charAt(0) || "?"}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-white/60">
            Service Provider
          </p>
          <p className="text-base font-semibold">{providerName}</p>
        </div>
      </div>

      {/* SERVICE TITLE */}
      <h3 className="text-2xl font-bold mb-1">{serviceTitle}</h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-white/80 mb-5 line-clamp-3">
        {serviceDescription || "No description provided."}
      </p>

      {/* PRICING BOX */}
      <div className="bg-white/10 rounded-2xl p-4 mb-5 border border-white/10">
        <div className="flex justify-between text-sm">
          <span className="opacity-80">Fixed Rate</span>
          <span className="font-semibold">
            {fixedPriceAvailable ? "Available" : "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="opacity-80">Hourly</span>
          <span className="font-semibold">
            {hourlyRate ? `Rs. ${hourlyRate}` : "—"}
          </span>
        </div>
      </div>


        {/* PROVIDER STATUS */}
        {isProviderView && verificationStatus && (
          <div className="mb-4 flex items-center justify-between">

            {/* LEFT — Verification badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  verificationStatus === "APPROVED"
                    ? "bg-green-500/20 text-green-300"
                    : verificationStatus === "PENDING"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-red-500/20 text-red-300"
                }`}
            >
              {verificationStatus}
            </span>

            {/* RIGHT — Active toggle (only if APPROVED) */}
            {verificationStatus === "APPROVED" && typeof isActive === "boolean" && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/70">Active</span>

                <button
                  type="button"
                  onClick={() => onToggleActive(providerServiceId)}
                  className={`relative w-11 h-6 rounded-full transition
                    ${isActive ? "bg-emerald-500" : "bg-gray-500"}
                  `}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                      transition-transform
                      ${isActive ? "translate-x-5" : "translate-x-0"}
                    `}
                  />
                </button>
              </div>
            )}

          </div>
        )}


      {/* BOTTOM META */}
      <div className="mt-auto flex items-center justify-between text-sm text-white/80">
        <span className="flex items-center gap-1">
          ⭐ {rating ?? "New"}
        </span>
        <span className="truncate max-w-[140px]">
          📍 {location || "Unknown"}
        </span>
      </div>

      {/* CUSTOMER CTA */}
      {showViewProfile && (
        <button
          onClick={() => navigate(`/provider/${providerServiceId}`)}
          className="
            mt-4
            w-full py-3
            rounded-2xl
            bg-orange-500
            font-semibold
            text-white
            hover:bg-orange-600
            transition
          "
        >
          View profile
        </button>
      )}
    </div>
  );
}
