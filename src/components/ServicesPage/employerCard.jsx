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
    isProviderView = false,
    showViewProfile = true,
  } = employer;

  const imgSrc = providerProfileImage
    ? providerProfileImage.startsWith("http")
      ? providerProfileImage
      : `${import.meta.env.VITE_BACKEND_URL}${providerProfileImage}`
    : null;

  const status = (verificationStatus || "").toUpperCase();

  const statusPill =
    status.includes("APPROV")
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status.includes("PEND")
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
      : status.includes("REJEC")
      ? "bg-rose-500/10 text-rose-700 dark:text-rose-300"
      : "bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-slate-200";

  const canToggle = isProviderView && status.includes("APPROV") && typeof isActive === "boolean";

  return (
    <div
      className="
        w-full max-w-[360px] mx-auto
        rounded-3xl
        border border-white/10
        bg-white/70 dark:bg-white/5
        backdrop-blur
        shadow-lg shadow-black/5
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        overflow-hidden
      "
    >

      <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />
      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-black/5 dark:bg-white/10">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={providerName || "Provider"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-semibold text-slate-700 dark:text-slate-200">
                  {(providerName?.charAt(0) || "?").toUpperCase()}
                </div>
              )}
            </div>

            {/* Online/active dot (visual) */}
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-950 ${
                isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </div>

          {/* Provider info */}
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Service Provider
            </p>
            <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
              {providerName || "Unknown"}
            </p>

            {/* Pills row */}
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {/* Rating */}
              <span
                className="
                  inline-flex items-center gap-1
                  px-2.5 py-1
                  rounded-full
                  text-xs font-medium
                  bg-slate-900/5 text-slate-700
                  dark:bg-white/10 dark:text-slate-200
                "
                title={rating ?? "New"}
              >
                <span className="text-yellow-500">★</span>
                <span className="leading-none">{rating ?? "New"}</span>
              </span>

              {/* Location */}
              <span
                className="
                  inline-flex items-center gap-1
                  px-2.5 py-1
                  rounded-full
                  text-xs font-medium
                  bg-slate-900/5 text-slate-700
                  dark:bg-white/10 dark:text-slate-200
                  max-w-[170px]
                "
                title={location || "Unknown"}
              >
                <span className="text-red-500">📍</span>
                <span className="truncate">{location || "Unknown"}</span>
              </span>

              {/* Provider-only verification pill */}
              {isProviderView && verificationStatus && (
                <span
                  className={`
                    inline-flex items-center
                    px-2.5 py-1 rounded-full
                    text-xs font-semibold
                    ${statusPill}
                  `}
                  title={verificationStatus}
                >
                  {verificationStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
          {serviceTitle || "Service"}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {serviceDescription || "No description provided."}
        </p>

        {/* Pricing */}
        <div
          className="
            mt-5
            rounded-2xl
            border border-black/5 dark:border-white/10
            bg-white/60 dark:bg-white/5
            p-4
          "
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Fixed Rate</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {fixedPriceAvailable ? "Available" : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-600 dark:text-slate-300">Hourly</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {hourlyRate ? `Rs. ${Number(hourlyRate).toLocaleString("en-LK")}` : "—"}
            </span>
          </div>
        </div>

        {/* Provider-only toggle row */}
        {canToggle && (
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Active
            </span>

            <button
              type="button"
              onClick={() => onToggleActive?.(providerServiceId)}
              className={`relative w-11 h-6 rounded-full transition ${
                isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
              title="Toggle service active"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        )}

        {/* CTA (keep compatible) */}
        {showViewProfile && (
          <button
            onClick={() => navigate(`/book/${providerServiceId}`)}
            className="
              mt-6 w-full py-3
              rounded-2xl
              bg-slate-800 text-white
              hover:bg-slate-900
              font-semibold
              transition
              shadow-sm
            "
          >
            View Profile
          </button>
        )}
      </div>
    </div>
  );
}