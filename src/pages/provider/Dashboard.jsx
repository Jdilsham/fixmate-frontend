import { useState, useEffect } from "react";
import Header from "../../components/header";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getAuthUser } from "../../../utils/auth";
import { getUserProfile } from "../../../utils/profile";
import EmployerCard from "../../components/ServicesPage/employerCard";
import BookingsTable from "../../components/dashboard/bookingTable";
import {
  Home,
  Calendar as CalendarIcon,
  Settings,
  Briefcase,
} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import { updateAvailability } from "../../../utils/profile";
import { updateProviderProfile } from "../../../utils/profile";
import toast from "react-hot-toast";

/* =======================
   ROLE CONFIG
======================= */
const ROLE_CONFIG = {
  SERVICE_PROVIDER: {
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "services", label: "Services", icon: Briefcase },
      { id: "calendar", label: "Calendar", icon: CalendarIcon },
      { id: "profile", label: "Profile", icon: Settings },
    ],
  },
  CUSTOMER: {
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "profile", label: "Profile", icon: Settings },
    ],
  },
};

export default function Dashboard() {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [date, setDate] = useState(new Date());
  const [isAvailable, setIsAvailable] = useState(false);

  const [openSection, setOpenSection] = useState("basic");
  const [editingSection, setEditingSection] = useState(null);

  const user = authUser && profile ? { ...authUser, ...profile } : authUser;

  const [profileForm, setProfileForm] = useState({
    skill: "",
    experience: "",
    address: "",
    city: "",
    description: "",
    workPdf: null,
  });

  const reloadProfile = async () => {
  const auth = getAuthUser();
  if (!auth) {
    setAuthUser(null);
    setLoading(false);
    return;
  }

 
  setAuthUser(auth);

  setLoading(true);

  const profileData = await getUserProfile();

  setProfile(profileData);
  setIsAvailable(profileData?.available ?? false);

  setProfileForm({
    skill: profileData?.service || "",
    experience: profileData?.experience || "",
    address: profileData?.address || "",
    city: profileData?.city || "",
    description: profileData?.description || "",
    workPdf: null,
  });

  setActiveTab("profile"); // stay on profile
  setLoading(false);
};


  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("skill", profileForm.skill);
      formData.append("experience", profileForm.experience);
      formData.append("address", profileForm.address);
      formData.append("city", profileForm.city);
      formData.append("description", profileForm.description);

      if (profileForm.workPdf) {
        formData.append("workPdf", profileForm.workPdf);
      }

      const updated = await updateProviderProfile(formData);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              skill: updated.skill ?? prev.skill,
              description: updated.description ?? prev.description,
              city: updated.city ?? prev.city,
              isAvailable: updated.isAvailable ?? prev.isAvailable,
              experience: updated.experience ?? prev.experience,
              address: updated.address ?? prev.address,
            }
          : prev
      );

      setEditingSection(null);

      await reloadProfile();
      toast.success("Profile updated successfully");

    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  useEffect(() => {
  reloadProfile();
}, []);


  const role = user?.role;
  const tabs = ROLE_CONFIG[role]?.tabs || [];

  useEffect(() => {
    if (tabs.length === 0) return;
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, tabs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Session expired. Please login again.
      </div>
    );
  }

  const bookings =
    role === "SERVICE_PROVIDER"
      ? [
          {
            id: 1,
            customerName: "John Doe",
            service: "Electrical Repair",
            date: "2025-01-02",
            amount: 4500,
            status: "Completed",
          },
        ]
      : [
          {
            id: 1,
            providerName: "Mike Electric",
            service: "Wiring Fix",
            date: "2025-01-01",
            amount: 3000,
            status: "Completed",
          },
        ];

  const providerProfile =
    role === "SERVICE_PROVIDER"
      ? {
          id: user?.id,
          name: user?.fullName,
          service: user?.service,
          description: user?.description || "No description provided.",
          location: user?.city || "Not specified",
        }
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex max-w-9xl mx-auto px-6 pt-8 gap-6">
        <aside className="w-64 shrink-0">
          <div className="bg-card border rounded-2xl p-4 sticky top-24 h-[calc(100vh-140px)] overflow-auto">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Navigation
            </p>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="bg-card border rounded-2xl p-6">
            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-semibold">Rs. 0</p>
                  </Card>

                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {role === "SERVICE_PROVIDER"
                        ? "Jobs Completed"
                        : "Requests"}
                    </p>
                    <p className="text-2xl font-semibold">0</p>
                  </Card>

                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-semibold">—</p>
                  </Card>
                </div>

                <BookingsTable role={role} bookings={bookings} />
              </>
            )}

            {/* SERVICES */}
            {activeTab === "services" && role === "SERVICE_PROVIDER" && (
              <>
                <h2 className="text-lg font-semibold mb-4">My Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {providerProfile && (
                    <EmployerCard employer={providerProfile} />
                  )}
                </div>
              </>
            )}

            {/* CALENDAR */}
            {activeTab === "calendar" && role === "SERVICE_PROVIDER" && (
              <>
                <h2 className="text-lg font-semibold mb-4">Availability</h2>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-xl border"
                />
              </>
            )}

            {/* PROFILE */}
            {activeTab === "profile" && (
              <>
                {/* PROFILE HEADER */}
                <div className="flex items-center gap-10 border-b pb-6 mb-6">
                  <div className="relative w-40 h-40 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-accent" />

                    <Avatar.Root className="relative w-full h-full rounded-full overflow-hidden">
                      <Avatar.Image
                        src={user?.profilePicture || ""}
                        alt={user?.username || "Profile Picture"}
                        className="w-full h-full object-cover"
                      />
                      <Avatar.Fallback className="flex items-center justify-center w-full h-full text-2xl font-semibold">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <span
                      className={`w-5 h-5 rounded-full absolute bottom-2 right-4 border-2 border-background ${
                        isAvailable ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xl font-semibold">
                      {user?.fullName || user?.username}
                    </p>
                    <p className="text-sm text-muted-foreground">{role}</p>

                    {role === "SERVICE_PROVIDER" && (
                      <p className="text-sm text-muted-foreground">
                        Skill:{" "}
                        <span className="font-medium">
                          {user?.service || "Not set"}
                        </span>
                      </p>
                    )}

                    {role === "SERVICE_PROVIDER" && (
                      <p className="text-sm text-muted-foreground">
                        {user?.city || "Location not set"}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground">
                      {user?.phone || "Phone number not set"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Verified:</span>{" "}
                      {user?.verified ? "Yes" : "No"}
                    </p>

                    {role === "SERVICE_PROVIDER" && (
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-sm font-medium">
                          Availability:
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            const newVal = !isAvailable;
                            setIsAvailable(newVal); // animation state ONLY

                            try {
                              await updateAvailability(newVal);
                            } catch {
                              setIsAvailable(!newVal); // rollback
                            }
                          }}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            isAvailable ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                              isAvailable ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* EDIT PROFILE */}
                <h2 className="text-lg font-semibold mb-6">Update Profile</h2>

                <div className="space-y-4 max-w-xl">
                  <CollapsibleSection
                    title="Basic Information"
                    section="basic"
                    openSection={openSection}
                    setOpenSection={setOpenSection}
                    isEditing={editingSection === "basic"}
                    onEdit={() => setEditingSection("basic")}
                    onCancel={() => setEditingSection(null)}
                    onSave={handleSaveProfile}
                  >
                    <Input
                      label="Full Name"
                      defaultValue={user?.fullName || user?.username || ""}
                      disabled={editingSection !== "basic"}
                    />
                    <Input
                      label="City"
                      defaultValue={user?.city || ""}
                      value={profileForm.city}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, city: e.target.value }))
                      }
                      disabled={editingSection !== "basic"}
                    />
                    {role === "SERVICE_PROVIDER" && <Input
                      label="Skill"
                      value={profileForm.skill}
                      defaultValue={user?.service || ""}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, skill: e.target.value }))
                      }
                      disabled={editingSection !== "basic"}
                    />}
                    {role === "SERVICE_PROVIDER" && <Input
                      label="Experience"
                      value={profileForm.experience}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          experience: e.target.value,
                        }))
                      }
                      disabled={editingSection !== "basic"}
                    />}

                    <Input
                      label="Address"
                      value={profileForm.address}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                      disabled={editingSection !== "basic"}
                    />
                    {role === "SERVICE_PROVIDER" && <Input
                      label="Description"
                      value={profileForm.description}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      disabled={editingSection !== "basic"}
                    />}
                    {role === "SERVICE_PROVIDER" && <Input
                      label="Work PDF"
                      type="file"
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          workPdf: e.target.files?.[0] || null,
                        }))
                      }
                      disabled={editingSection !== "basic"}
                    />}
                  </CollapsibleSection>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* =======================
   COLLAPSIBLE SECTION
======================= */
function CollapsibleSection({
  title,
  section,
  openSection,
  setOpenSection,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  children,
}) {
  const isOpen = openSection === section;

  return (
    <div className="border rounded-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => setOpenSection(isOpen ? null : section)}
          className="flex items-center gap-2 "
        >
          <span className="font-medium">{title}</span>
          <span
            className={`transition-transform ${isOpen ? "rotate-180" : ""} `}
          >
            ▼
          </span>
        </button>

        {isOpen && !isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm text-primary hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {children}

          {isEditing && (
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onSave}
                className="rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border px-5 py-2 text-sm hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =======================
   REUSABLE INPUT
======================= */
function Input({
  label,
  type = "text",
  value,
  defaultValue,
  onChange,
  disabled,
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 bg-background ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}
