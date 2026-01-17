import { useState } from "react";


export default function AddEmployerModal({
  profile,
  onClose,
  onSubmit,
  serviceForm,
  setServiceForm,
  setPdfFile,
  categories,
  providerServices
}) {
  const handleSubmit = () => {
    if (!serviceForm.serviceId) {
      alert("Please select a service category");
      return;
    }

    onSubmit(serviceForm);
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

        <select
          className="input w-full"
          value={serviceForm.serviceId}
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
              <option
                key={cat.id}
                value={cat.id}
                disabled={alreadyAdded}
              >
                {cat.name} {alreadyAdded ? "(Already added)" : ""}
              </option>
            );
          })}
        </select>


        {/* DESCRIPTION */}
        <textarea
          placeholder="Service Description"
          className="input w-full h-24"
          value={serviceForm.description}
          onChange={(e) =>
            setServiceForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />

        {/* FIXED PRICE */}
        <input
          type="number"
          placeholder="Fixed Price"
          className="input w-full"
          value={serviceForm.fixedPrice}
          onChange={(e) =>
            setServiceForm((prev) => ({
              ...prev,
              fixedPrice: e.target.value,
            }))
          }
        />

        {/* HOURLY RATE */}
        <input
          type="number"
          placeholder="Hourly Rate"
          className="input w-full"
          value={serviceForm.hourlyRate}
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
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
