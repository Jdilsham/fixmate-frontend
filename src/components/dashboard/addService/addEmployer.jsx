import { useState } from "react";

export default function AddEmployerModal({ profile, onClose, onSubmit }) {
  const [form, setForm] = useState({
    skill: "",
    description: "",
    experience: "",
    rateType: "hourly",
    rate: "",
    proofPdf: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl p-6 w-full max-w-lg space-y-4">
        <h2 className="text-xl font-semibold">Add New Service</h2>

        <div className="text-sm text-muted-foreground">
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Location:</strong> {profile.city}</p>
        </div>

        <input name="skill" placeholder="Skill" className="input w-full" onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="input w-full h-24" onChange={handleChange} />
        <input name="experience" placeholder="Experience" className="input w-full" onChange={handleChange} />

        <div className="flex gap-4">
          <select name="rateType" className="input w-1/2" onChange={handleChange}>
            <option value="hourly">Hourly</option>
            <option value="fixed">Fixed</option>
          </select>
          <input name="rate" placeholder="Rate" className="input w-1/2" onChange={handleChange} />
        </div>

        <input type="file" name="proofPdf" accept="application/pdf" onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">Add</button>
        </div>
      </div>
    </div>
  );
}
