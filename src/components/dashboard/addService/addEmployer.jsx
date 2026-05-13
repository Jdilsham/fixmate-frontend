import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

export default function AddEmployerModal({
  profile,
  onClose,
  onSubmit,
  serviceForm,
  setServiceForm,
  setPdfFile,
  categories,
  providerServices,
  districts,
}) {
  const [fileName, setFileName] = useState("");

  const alreadyAddedSet = useMemo(() => {
    return new Set((providerServices || []).map((ps) => ps.serviceId));
  }, [providerServices]);

  const handleSubmit = () => {
    if (!serviceForm.serviceId) {
      toast.error("Please select a service category");
      return;
    }

    if (!serviceForm.districtId) {
      toast.error("Please select a district");
      return;
    }

    const hasHourly =
      serviceForm.hourlyRate !== "" &&
      serviceForm.hourlyRate !== null &&
      Number(serviceForm.hourlyRate) > 0;

    const hasFixed = Boolean(serviceForm.fixedPriceAvailable);

    if (!hasHourly && !hasFixed) {
      toast.error("Please provide hourly rate or enable fixed price");
      return;
    }

    if (!fileName) {
      toast.error("Please upload verification PDF");
      return;
    }

    onSubmit({
      serviceId: Number(serviceForm.serviceId),
      districtId: Number(serviceForm.districtId),
      description: serviceForm.description || null,
      fixedPriceAvailable: hasFixed,
      hourlyRate: hasHourly ? Number(serviceForm.hourlyRate) : null,
    });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative min-h-full px-4 py-6 sm:py-10 flex items-start sm:items-center justify-center">
        {/* Modal */}
        <div
          className="
            relative w-full max-w-xl
            rounded-3xl
            border border-white/10
            bg-white/85 dark:bg-slate-950/70
            backdrop-blur
            shadow-2xl shadow-black/25
            overflow-hidden
            flex flex-col

            max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-5rem)]
          "
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

          {/* Top gradient header */}
          <div className="relative px-6 pt-6 pb-5 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-sky-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Add New Service
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Add details, pricing and upload your verification PDF.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="
                    h-10 w-10 rounded-2xl
                    bg-slate-900/5 hover:bg-slate-900/10
                    dark:bg-white/10 dark:hover:bg-white/15
                    text-slate-700 dark:text-slate-200
                    transition
                  "
                  aria-label="Close"
                  type="button"
                >
                  ✕
                </button>
              </div>

              {/* Provider Info chip */}
              <div
                className="
                  mt-4 rounded-2xl
                  border border-black/5 dark:border-white/10
                  bg-white/60 dark:bg-white/5
                  p-4
                "
              >
                <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm">
                  <p className="text-slate-700 dark:text-slate-200">
                    <span className="font-semibold">Name:</span>{" "}
                    {profile.fullName}
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    <span className="font-semibold">Location:</span>{" "}
                    {profile.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 space-y-4 overflow-y-auto">
            {/* Section: Category */}
            <div
              className="
                rounded-2xl
                border border-black/5 dark:border-white/10
                bg-white/60 dark:bg-white/5
                p-4
              "
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Service Category <span className="text-orange-500">*</span>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Required
                </span>
              </div>

              <select
                className="
                  mt-2 w-full rounded-2xl px-4 py-3 text-sm
                  border border-black/10 bg-white/80
                  focus:outline-none focus:ring-2 focus:ring-orange-500/60
                  dark:border-white/10 dark:bg-slate-950/40 dark:text-white
                "
                value={serviceForm.serviceId ?? ""}
                onChange={(e) =>
                  setServiceForm((prev) => ({
                    ...prev,
                    serviceId: e.target.value,
                  }))
                }
              >
                <option value="">Select Service Category</option>
                {(categories || []).map((cat) => {
                  const alreadyAdded = alreadyAddedSet.has(cat.id);
                  return (
                    <option key={cat.id} value={cat.id} disabled={alreadyAdded}>
                      {cat.name} {alreadyAdded ? "(Already added)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div
              className="
                rounded-2xl
                border border-black/5 dark:border-white/10
                bg-white/60 dark:bg-white/5
                p-4
              "
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Service Area (District) <span className="text-orange-500">*</span>
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Required
                </span>
              </div>

              <select
                className="
                  mt-2 w-full rounded-2xl px-4 py-3 text-sm
                  border border-black/10 bg-white/80
                  focus:outline-none focus:ring-2 focus:ring-orange-500/60
                  dark:border-white/10 dark:bg-slate-950/40 dark:text-white
                "
                value={serviceForm.districtId ?? ""}
                onChange={(e) =>
                  setServiceForm((prev) => ({
                    ...prev,
                    districtId: e.target.value,
                  }))
                }
              >
                <option value="">Select District</option>
                {(districts || []).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section: Description */}
            <div
              className="
                rounded-2xl
                border border-black/5 dark:border-white/10
                bg-white/60 dark:bg-white/5
                p-4
              "
            >
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Service Description
              </label>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                A short description helps customers understand what you offer.
              </p>

              <textarea
                className="
                  mt-2 w-full h-28 rounded-2xl px-4 py-3 text-sm resize-none
                  border border-black/10 bg-white/80
                  focus:outline-none focus:ring-2 focus:ring-orange-500/60
                  dark:border-white/10 dark:bg-slate-950/40 dark:text-white
                "
                placeholder="Describe your service briefly (tools, experience, what’s included...)"
                value={serviceForm.description ?? ""}
                onChange={(e) =>
                  setServiceForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {/* Section: Pricing */}
            <div
              className="
                rounded-2xl
                border border-black/5 dark:border-white/10
                bg-white/60 dark:bg-white/5
                p-4
              "
            >
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Pricing
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className="
                    flex items-center gap-3
                    rounded-2xl border border-black/10 dark:border-white/10
                    bg-white/80 dark:bg-slate-950/40
                    px-4 py-3
                    cursor-pointer
                  "
                >
                  <input
                    type="checkbox"
                    checked={!!serviceForm.fixedPriceAvailable}
                    onChange={(e) =>
                      setServiceForm((prev) => ({
                        ...prev,
                        fixedPriceAvailable: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-orange-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      Fixed price
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      You can offer a fixed rate option
                    </p>
                  </div>
                </label>

                <div
                  className="
                    rounded-2xl border border-black/10 dark:border-white/10
                    bg-white/80 dark:bg-slate-950/40
                    px-4 py-3
                  "
                >
                  <label className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Hourly Rate (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={serviceForm.hourlyRate ?? ""}
                    onChange={(e) =>
                      setServiceForm((prev) => ({
                        ...prev,
                        hourlyRate: e.target.value,
                      }))
                    }
                    className="
                      mt-2 w-full rounded-xl px-3 py-2 text-sm
                      border border-black/10 bg-white
                      focus:outline-none focus:ring-2 focus:ring-orange-500/60
                      dark:border-white/10 dark:bg-slate-950/40 dark:text-white
                    "
                  />
                </div>
              </div>
            </div>

            {/* Section: PDF upload */}
            <div
              className="
                rounded-2xl
                border border-black/5 dark:border-white/10
                bg-white/60 dark:bg-white/5
                p-4
              "
            >
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Verification Document (PDF)
              </label>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Required for admin verification of this service.
              </p>

              <div
                className="
                  mt-3 flex items-center justify-between gap-3
                  rounded-2xl
                  border border-dashed border-black/15 dark:border-white/15
                  bg-white/70 dark:bg-slate-950/30
                  px-4 py-4
                "
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                    {fileName || "No file selected"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PDF only • Max size depends on server
                  </p>
                </div>

                <label
                  className="
                    shrink-0 cursor-pointer
                    px-4 py-2 rounded-2xl text-sm font-semibold
                    bg-orange-500 text-white hover:bg-orange-600
                    transition
                  "
                >
                  Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setPdfFile(f);
                      setFileName(f ? f.name : "");
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-black/5 dark:border-white/10 shrink-0">
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                type="button"
                className="
                  w-full sm:w-auto
                  px-5 py-3 rounded-2xl text-sm font-semibold
                  bg-slate-900/5 hover:bg-slate-900/10
                  dark:bg-white/10 dark:hover:bg-white/15
                  text-slate-800 dark:text-slate-100
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                type="button"
                className="
                  w-full sm:w-auto
                  px-5 py-3 rounded-2xl text-sm font-semibold
                  bg-orange-500 text-white hover:bg-orange-600
                  transition shadow-sm
                "
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}