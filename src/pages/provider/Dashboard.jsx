import { useState, useEffect } from "react";
import Header from "../../components/header";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getAuthUser } from "../../../utils/auth";
import { getUserProfile } from "../../../utils/profile";
import EmployerCard from "../../components/ServicesPage/employerCard";
import BookingsTable from "../../components/dashboard/bookingTable";
import {Home,Calendar as CalendarIcon,Settings,Briefcase} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import { updateAvailability } from "../../../utils/profile";
import { updateProviderProfile } from "../../../utils/profile";
import { getProviderAddress } from "../../../utils/profile";
import {addProviderAddress, updateProviderAddress,} from "../../../utils/profile";
import { updateProviderProfilePicture } from "../../../utils/profile";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import EditImageModal from "../../components/dashboard/editProfilePic";



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
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [date, setDate] = useState(new Date());
  const [isAvailable, setIsAvailable] = useState(false);
  const [editImageOpen, setEditImageOpen] = useState(false);

  const [openSection, setOpenSection] = useState("basic");
  const [editingSection, setEditingSection] = useState(null);

  const user = authUser && profile ? { ...authUser, ...profile } : authUser;

  const [profileForm, setProfileForm] = useState({
  firstName: "",
  lastName: "",
  phone: "",
  });

  const [hasAddress, setHasAddress] = useState(false);


  const [addressForm, setAddressForm] = useState({
    addressLine1: "",
    addressLine2: "",
    province: "",
    city: "",
    latitude: "",
    longitude: "",
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

    console.log("PROFILE FROM BACKEND:", profileData);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    setProfile(profileData);


    setIsAvailable(profileData?.available ?? false);

    setProfileForm({
      firstName: profileData?.fullName?.split(" ")[0] || "",
      lastName: profileData?.fullName?.split(" ")[1] || "",
      phone: profileData?.phone || "",
    });


        // LOAD PROVIDER ADDRESS
    try {
      const addr = await getProviderAddress();

      if (addr) {
        setHasAddress(true);
        setAddressForm({
          addressLine1: addr.addressLine1 || "",
          addressLine2: addr.addressLine2 || "",
          province: addr.province || "",
          city: addr.city || "",
          latitude: addr.latitude ?? "",
          longitude: addr.longitude ?? "",
        });
      } else {
        setHasAddress(false);
      }
    } catch (err) {
      console.error("Failed to load provider address", err);
      setHasAddress(false);
    }


    setActiveTab("profile"); // stay on profile
    setLoading(false);
  };

    const handleSaveProfile = async () => {
    try {
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
      };

      await updateProviderProfile(payload);

      toast.success("Profile updated successfully");
      setEditingSection(null);
      await reloadProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };


  
    const handleSaveAddress = async () => {
    try {
      const payload = {
        addressLine1: addressForm.addressLine1,
        addressLine2: addressForm.addressLine2,
        province: addressForm.province,
        city: addressForm.city,
        latitude: addressForm.latitude
          ? Number(addressForm.latitude)
          : null,
        longitude: addressForm.longitude
          ? Number(addressForm.longitude)
          : null,
      };

      if (hasAddress) {
        await updateProviderAddress(payload);
        toast.success("Address updated successfully");
      } else {
        await addProviderAddress(payload);
        setHasAddress(true);
        toast.success("Address added successfully");
      }


      setEditingSection(null);
      await reloadProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
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
          fullName: user?.fullName,
          service: user?.service,
          description: user?.description || "No description provided.",
          location: user?.city || "Not specified",
        }
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
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
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6 mb-8">
                  <div className=" flex flex-col relative w-28 h-28 md:w-36 md:h-36 shrink-0 justify-end">
                    <div className="absolute flex flex-col items-center inset-0 rounded-full bg-transparent">

                      <Avatar.Root
                          key={user?.profilePicture}
                          className="relative w-full h-full rounded-full overflow-hidden bg-background"
                        >
                        <Avatar.Image
                          src={user?.profilePicture}
                          alt="Profile Picture"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center"
                        />
                        <Avatar.Fallback className="flex items-center justify-center w-full h-full text-2xl font-semibold">
                          U
                        </Avatar.Fallback>
                      </Avatar.Root>



                      <span
                        className={`w-5 h-5 rounded-full absolute top-4 right-2 border-2 border-background ${
                          isAvailable ? "bg-green-500" : "bg-red-500"
                        }`}
                      />

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditImageOpen(true);
                        }}
                        className=" text center p-4  "
                      >
                        edit picture
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-center md:text-left">
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
                        {addressForm.city
                          ? `${addressForm.city}, ${addressForm.province}`
                          : "Location not set"}
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
                      <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-muted px-4 py-2">
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

                <div className="grid grid-cols-1  gap-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                      <Input
                        label="First Name"
                        value={profileForm.firstName}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, firstName: e.target.value }))
                        }
                        disabled={editingSection !== "basic"}
                      />

                      <Input
                        label="Last Name"
                        value={profileForm.lastName}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, lastName: e.target.value }))
                        }
                        disabled={editingSection !== "basic"}
                      />

                      <Input
                        label="Phone Number"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        disabled={editingSection !== "basic"}
                      />

                      
                      {/* {role === "SERVICE_PROVIDER" && (
                        <Input
                          label="Experience"
                          value={profileForm.experience}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              experience: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "basic"}
                        />
                      )} */}

                      {/* {role === "SERVICE_PROVIDER" && (
                        <Input
                          label="Description"
                          value={profileForm.description}
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "basic"}
                        />
                      )}
                      {role === "SERVICE_PROVIDER" && (
                        <Input
                          label="Work PDF"
                          type="file"
                          onChange={(e) =>
                            setProfileForm((p) => ({
                              ...p,
                              workPdf: e.target.files?.[0] || null,
                            }))
                          }
                          disabled={editingSection !== "basic"}
                        />
                      )} */}
                    </div>
                  </CollapsibleSection>
                  <CollapsibleSection
                    title="Address"
                    section="address"
                    openSection={openSection}
                    setOpenSection={setOpenSection}
                    isEditing={editingSection === "address"}
                    onEdit={() => setEditingSection("address")}
                    onCancel={() => setEditingSection(null)}
                    onSave={handleSaveAddress}
                    hasAddress={hasAddress}  
                    showAddInstead={true}
                  >
                    <Input
                      label="Address Line 1"
                      value={addressForm.addressLine1}
                      onChange={(e) =>
                        setAddressForm((p) => ({ ...p, addressLine1: e.target.value }))
                      }
                      disabled={editingSection !== "address"}
                    />

                    <Input
                      label="Address Line 2"
                      value={addressForm.addressLine2}
                      onChange={(e) =>
                        setAddressForm((p) => ({ ...p, addressLine2: e.target.value }))
                      }
                      disabled={editingSection !== "address"}
                    />

                    <Input
                      label="Province"
                      value={addressForm.province}
                      onChange={(e) =>
                        setAddressForm((p) => ({ ...p, province: e.target.value }))
                      }
                      disabled={editingSection !== "address"}
                    />

                    <Input
                      label="City"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm((p) => ({ ...p, city: e.target.value }))
                      }
                      disabled={editingSection !== "address"}
                    />

                    <Input
                      label="Latitude"
                      value={addressForm.latitude}
                      onChange={(e) =>
                        setAddressForm((p) => ({ ...p, latitude: e.target.value }))
                      }
                      disabled={editingSection !== "address"}
                    />

                    <Input
                      label="Longitude"
                      value={addressForm.longitude}
                      onChange={(e) =>
                        setAddressForm((p) => ({ ...p, longitude: e.target.value }))
                      }
                      disabled={editingSection !== "address"}
                    />

                  </CollapsibleSection>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      {editImageOpen && (
        <EditImageModal
          onClose={() => {
            setEditImageOpen(false);
            reloadProfile();
      }}
  />
)}

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
  hasAddress,   
  showAddInstead,
  children,
}) {
  const isOpen = openSection === section;

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
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
            {showAddInstead && !hasAddress ? "Add Address" : "Edit"}
          </button>
        )}

      </div>

      {isOpen && (
        <div className="px-5 pb-5 space-y-4">
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



