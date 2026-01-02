import { useState , useEffect } from "react";
import Header from "../components/header";
import { useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";



export default function ProfilePage() {
  
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams();
  const isPublicProfile = Boolean(id);

  const providerTabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
    {id: "availability", label: "Availability" },
    { id: "settings", label: "Settings" },
    { id: "calendar", label: "Calendar" },
  ];

  const customerTabs = [
    { id: "overview", label: "Overview" },
    { id: "requests", label: "Requests" },
    { id: "saved", label: "Saved" },
    { id: "settings", label: "Settings" },
  ];  

  const publicTabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
  ];

  const role = localStorage.getItem("role");
  const tabs = isPublicProfile ? publicTabs : role === "PROVIDER" ? providerTabs : customerTabs;


  const EMPLOYEES = [
    {
      id: "john-doe",
      name: "John Doe",
      service: "electrician",
      description:
        "Experienced electrician specializing in residential and commercial projects.",
      location: "Galle",
    },
    {
      id: "jane-smith",
      name: "Jane Smith",
      service: "plumber",
      description:
        "Experienced plumber specializing in residential and commercial projects.",
      location: "Matara",
    },
    {
      id: "mike-johnson",
      name: "Mike Johnson",
      service: "carpenter",
      description:
        "Experienced carpenter specializing in residential and commercial projects.",
      location: "Hambantota",
    },
    {
      id: "sara-lee",
      name: "Sara Lee",
      service: "mechanic",
      description: "Experienced mechanic specializing in vehicle repair.",
      location: "Gampaha",
    },
    {
      id: "jason-borne",
      name: "Jason Borne",
      service: "electrician",
      description:
        "Experienced electrician specializing in residential and commercial projects.",
      location: "Colombo",
    },
  ];

  const username = localStorage.getItem("username") || "Logged In User";
  const loggedInProfile = {
    name: localStorage.getItem("name") || username,
    service: role === "PROVIDER" ? "Service Provider" : "Customer",
    description: "This is your personal profile.",
    location: "N/A",
  };
  const profile = isPublicProfile ? EMPLOYEES.find((emp) => emp.id === id) : loggedInProfile;

  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
  if (isPublicProfile && !publicTabs.some(t => t.id === activeTab)) {
    setActiveTab("overview");
  }
}, [isPublicProfile, activeTab]);


  if (!profile) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-semibold">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ================= SIDEBAR ================= */}
          <aside className="w-full lg:w-1/4 lg:min-w-[260px]">
            <div className="lg:sticky lg:top-24 bg-card border border-border rounded-3xl p-6">
              {/* Profile summary */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                  {profile?.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.service}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.location}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      shrink-0 text-left px-4 py-3 rounded-xl transition
                      ${
                        activeTab === tab.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ================= CONTENT ================= */}
          <main className="w-full lg:w-3/4">
            <div className="bg-card border border-border rounded-3xl p-8 min-h-[500px]">
              {activeTab === "overview" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Profile Overview
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    This section shows general information about the
                    professional, including experience, location, and
                    availability.
                  </p>
                </section>
              )}

              {activeTab === "services" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Services Offered
                  </h2>
                  <p className="text-muted-foreground">{profile.description}</p>
                </section>
              )}

              {activeTab === "reviews" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Customer Reviews
                  </h2>
                  <p className="text-muted-foreground">
                    Ratings and feedback from previous clients.
                  </p>
                </section>
              )}

              {!isPublicProfile && role === "PROVIDER" && activeTab === "settings" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Account Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Manage profile and account preferences.
                  </p>
                </section>
              )}

              {!isPublicProfile && role === "PROVIDER" && activeTab === "calendar" && (
                <section>
                  <div className="flex justify-around">
                    <div>
                      <h2 className="text-3xl font-semibold mb-4">Calendar</h2>

                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-2xl border"
                      />

                      <p className="text-muted-foreground mt-4">
                        View and manage your schedule.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mt-8 mb-4">
                        Appointments
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">
                                Appointment with John Doe
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                10:00 AM - 11:00 AM
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
