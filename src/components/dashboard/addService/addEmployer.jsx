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
      hourlyRate: serviceForm.fixedPriceAvailable
        ? null
        : serviceForm.hourlyRate === ""
          ? null
          : Number(serviceForm.hourlyRate),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Add New Service</h2>

        {/* Provider Info */}
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Name:</strong> {profile.fullName}
          </p>
          <p>
            <strong>Location:</strong> {profile.city}
          </p>
        </div>

        {/* CATEGORY */}
        

        <select
          className="input w-full bg-card"
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
              (ps) => ps.serviceId === cat.id,
            );

            return (
              <option key={cat.id} value={cat.id} disabled={alreadyAdded}>
                {cat.name} {alreadyAdded ? "(Already added)" : ""}
              </option>
            );
          })}
        </select>

        {/* DESCRIPTION */}
        <textarea
          className="input w-full h-24"
          placeholder="Service description"
          value={serviceForm.description ?? ""}
          onChange={(e) =>
            setServiceForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />

        {/* FIXED PRICE */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!serviceForm.fixedPriceAvailable}
            onChange={(e) =>
              setServiceForm((prev) => ({
                ...prev,
                fixedPriceAvailable: e.target.checked,
                hourlyRate: e.target.checked ? "" : prev.hourlyRate,
              }))
            }
          />
          Fixed price available
        </label>

        {/* HOURLY RATE */}
        <input
          type="number"
          className="input w-full"
          placeholder="Hourly rate (optional)"
          disabled={serviceForm.fixedPriceAvailable}
          value={serviceForm.hourlyRate ?? ""}
          onChange={(e) =>
            setServiceForm((prev) => ({
              ...prev,
              hourlyRate: e.target.value,
            }))
          }
        />

        {/* PDF UPLOAD */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="btn-secondary hover:bg-accent w-[80px] rounded-2xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary hover:bg-accent w-[80px] rounded-2xl"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
