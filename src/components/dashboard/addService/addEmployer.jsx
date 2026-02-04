export default function AddEmployerModal({
  profile,
  onClose,
  onSubmit,
  serviceForm,
  setServiceForm,
  setPdfFile,
  categories,
  providerServices,
}) {
  const handleSubmit = () => {
    if (!serviceForm.serviceId) {
      alert("Please select a service category");
      return;
    }

    onSubmit({
      serviceId: Number(serviceForm.serviceId),
      description: serviceForm.description || null,
      fixedPriceAvailable: Boolean(serviceForm.fixedPriceAvailable),
      hourlyRate:
        serviceForm.hourlyRate === "" ? null : Number(serviceForm.hourlyRate),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="
          w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-5
          bg-white text-gray-800
          dark:bg-[#0f2f44] dark:text-slate-100
        "
      >
        {/* HEADER */}
        <h2 className="text-xl font-semibold">
          Add New Service
        </h2>

        {/* PROVIDER INFO */}
        <div
          className="
            rounded-xl p-4 text-sm space-y-1
            bg-gray-100
            dark:bg-[#1f4e6b]
          "
        >
         <p>
            <span className="font-medium">Name:</span> {profile.fullName}
          </p>
          <p>
            <span className="font-medium">Location:</span> {profile.location}
          </p>
        </div>

        {/* SERVICE CATEGORY */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Service Category
          </label>
          <select
            className="
              w-full rounded-xl px-3 py-2 text-sm
              border border-gray-300 bg-white
              focus:outline-none focus:ring-2 focus:ring-orange-500
              dark:border-[#2f6b8f] dark:bg-[#163e57]
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
            {categories.map((cat) => {
              const alreadyAdded = providerServices.some(
                (ps) => ps.serviceId === cat.id
              );

              return (
                <option key={cat.id} value={cat.id} disabled={alreadyAdded}>
                  {cat.name} {alreadyAdded ? "(Already added)" : ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* SERVICE DESCRIPTION */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Service Description
          </label>
          <textarea
            className="
              w-full h-24 rounded-xl px-3 py-2 text-sm resize-none
              border border-gray-300 bg-white
              focus:outline-none focus:ring-2 focus:ring-orange-500
              dark:border-[#2f6b8f] dark:bg-[#163e57]
            "
            placeholder="Describe your service briefly"
            value={serviceForm.description ?? ""}
            onChange={(e) =>
              setServiceForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        {/* PRICING */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Pricing Options</p>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!serviceForm.fixedPriceAvailable}
              onChange={(e) =>
                setServiceForm((prev) => ({
                  ...prev,
                  fixedPriceAvailable: e.target.checked,
                }))
              }
              className="accent-orange-500"
            />
            <span className="text-sm">Fixed price available</span>
          </div>

          <div className="space-y-1">
            <label className="text-sm">Hourly Rate (optional)</label>
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
                w-full rounded-xl px-3 py-2 text-sm
                border border-gray-300 bg-white
                focus:outline-none focus:ring-2 focus:ring-orange-500
                dark:border-[#2f6b8f] dark:bg-[#163e57]
              "
            />
          </div>
        </div>

        {/* PDF UPLOAD */}
        <div className="space-y-1">
          <label className="text-sm font-medium">
            Verification Document (PDF)
          </label>
          <p className="text-xs opacity-70">
            Required for admin verification of this service
          </p>
          <input
            type="file"
            accept="application/pdf"
            className="
              w-full text-sm
              file:mr-3 file:rounded-lg file:border-0
              file:bg-orange-500 file:px-4 file:py-2 file:text-white
              hover:file:bg-orange-600
            "
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="
              px-5 py-2 rounded-xl text-sm
              border border-gray-300
              hover:bg-gray-100
              dark:border-[#2f6b8f] dark:hover:bg-[#1f4e6b]
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl text-sm bg-orange-500 text-white hover:bg-orange-600"
          >
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
}
