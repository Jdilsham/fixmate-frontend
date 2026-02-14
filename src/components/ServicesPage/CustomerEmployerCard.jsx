import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CustomerEmployerCard({ employer }) {
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
  } = employer;

  const imgSrc = providerProfileImage
    ? providerProfileImage.startsWith("http")
      ? providerProfileImage
      : `${import.meta.env.VITE_BACKEND_URL}${providerProfileImage}`
    : null;

  return (
    <div className="group relative w-full max-w-[360px] mx-auto">
      
      {/* subtle glow border */}
      <div className="pointer-events-none absolute -inset-[1px] rounded-[28px] opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-cyan-500/30 via-blue-500/25 to-emerald-500/25 blur-[6px]" />

      <div
        className="
          relative overflow-hidden rounded-[28px]
          border border-black/10 dark:border-white/10
          bg-white/80 dark:bg-slate-950/35
          backdrop-blur-xl
          shadow-[0_18px_70px_-55px_rgba(0,0,0,0.45)]
          group-hover:shadow-[0_28px_95px_-65px_rgba(0,0,0,0.75)]
          transition-all duration-300
        "
      >
        <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />
        {/* top accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-amber-400/15 via-orange-400/10 to-transparent dark:from-cyan-400/12 dark:via-blue-500/10" />

        <div className="relative p-6">
          {/* header */}
          <div className="flex items-center gap-4">
            {/* avatar */}
            <div className="relative shrink-0">
              <div
                className="
                  w-14 h-14 rounded-2xl overflow-hidden
                  ring-1 ring-black/10 dark:ring-white/10
                  bg-black/5 dark:bg-white/10
                "
              >
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

              {/* online dot */}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
            </div>

            {/* provider meta */}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Service Provider
              </p>

              <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
                {providerName || "Unknown"}
              </p>

              <div className="mt-2 flex items-center gap-2 flex-wrap">
                {/* rating */}
                <span
                  className="
                    inline-flex items-center gap-1
                    px-2.5 py-1 rounded-full text-xs font-medium
                    bg-slate-900/5 text-slate-700
                    dark:bg-white/10 dark:text-slate-200
                  "
                  title={rating ?? "New"}
                >
                  <span className="text-yellow-500">★</span>
                  <span className="leading-none">{rating ?? "New"}</span>
                </span>

                {/* location */}
                <span
                  className="
                    inline-flex items-center gap-1
                    px-2.5 py-1 rounded-full text-xs font-medium
                    bg-slate-900/5 text-slate-700
                    dark:bg-white/10 dark:text-slate-200
                    max-w-[170px]
                  "
                  title={location || "Unknown"}
                >
                  <span className="text-red-500">📍</span>
                  <span className="truncate">{location || "Unknown"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* title */}
          <h3 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {serviceTitle || "Service"}
          </h3>

          {/* description */}
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
            {serviceDescription || "No description provided."}
          </p>

          {/* pricing glass */}
          <div
            className="
              mt-5 rounded-2xl p-4
              border border-black/10 dark:border-white/10
              bg-white/70 dark:bg-white/[0.06]
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

          {/* CTA */}
          <Button
            onClick={() => navigate(`/book/${providerServiceId}`)}
            variant="fixmate"
            size="lg"
            className="mt-6 w-full rounded-2xl"
          >
            View Profile
          </Button>

          {/* micro footer line */}
          <div className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            Tap to view details & book instantly
          </div>
        </div>
      </div>
    </div>
  );
}