import { useState } from "react";
import EmployerCard from "../../ServicesPage/employerCard";
import AddServiceCard from "./addService";
import AddEmployerModal from "./addEmployer";

export default function EmployerGrid({ profile }) {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);

  const addService = (data) => {
    setServices((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        fullName: profile.fullName,
        location: profile.city,
        imageUrl: profile.profilePic,
        skill: data.skill,
        description: data.description,
        rating: "New",
        isVerified: false,
      },
    ]);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2">
        {services.map((s) => (
          <EmployerCard key={s.id} employer={s} />
        ))}

        <AddServiceCard profile={profile} onClick={() => setOpen(true)} />
      </div>

      {open && (
        <AddEmployerModal
          profile={profile}
          onClose={() => setOpen(false)}
          onSubmit={addService}
        />
      )}
    </>
  );
}
