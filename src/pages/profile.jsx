import { useState, useEffect } from "react";
import Header from "../components/header";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { getAuthUser } from "../../utils/auth";
import { EMPLOYEES } from "../data/EMPLOYEES";
import { Button } from "../components/ui/button";

export default function ProfilePage() {
  const { id } = useParams();
  const authUser = getAuthUser();
  const navigate = useNavigate();



  const isPublicProfile = Boolean(id);

  const profile = isPublicProfile
    ? EMPLOYEES.find(emp => emp.id === id)
    : {
        name: authUser?.username,
        service: authUser?.role,
        description: "This is your profile description.",
        location: "Your location",
      };

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        Profile not found
      </div>
    );
  }

  const activeUsername = profile.name;

  

  // SYSTEM role 
  const systemRole = authUser?.role;

  // DISPLAY role 
  const displayRole = isPublicProfile
    ? profile.service
    : systemRole;

  const isProviderProfile =
    isPublicProfile || systemRole === "SERVICE_PROVIDER";


  const isOwner =
    !isPublicProfile && systemRole === "SERVICE_PROVIDER";

  

  const [activeTab, setActiveTab] = useState("overview");
  const [date, setDate] = useState(new Date());



  const providerTabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
    { id: "availability", label: "Availability" },
    { id: "calendar", label: "Calendar" },
    { id: "settings", label: "Settings" },
  ];

  const customerTabs = [
    { id: "overview", label: "Overview" },
    { id: "requests", label: "Requests" },
    { id: "saved", label: "Saved" },
    
  ];

  const tabs = isProviderProfile ? providerTabs : customerTabs;

  

  useEffect(() => {
    // Prevent invalid tabs when switching profiles
    if (!tabs.some(t => t.id === activeTab)) {
      setActiveTab("overview");
    }
  }, [activeTab, tabs]);

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32 flex gap-8">
        {/* ================= SIDEBAR ================= */}
        <aside className="w-1/4">
          <div className="bg-card border rounded-3xl p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-semibold">
                {activeUsername.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">{activeUsername}</h3>
                <p className="text-sm text-muted-foreground">
                  {displayRole}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.location}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl text-left transition ${
                    activeTab === tab.id
                      ? "bg-accent"
                      : "hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 relative bg-card border rounded-3xl p-8">
          {activeTab === "overview" && (
            <p>{profile.description}</p>
          )}

          {activeTab === "services" && (
            <>
              <p>{profile.service}</p>
              <Button className=" absolute bottom-4 right-4"  onClick={() => navigate("/customer/bookings")}>Book services</Button>
            </>
          )}

          {isProviderProfile && activeTab === "availability" && (
            <h2 className="text-2xl">
              {isOwner ? "Edit Availability" : "Availability"}
            </h2>
          )}

          {isProviderProfile && activeTab === "calendar" && (
            <Calendar
              mode="single"
              selected={date}
              onSelect={isOwner ? setDate : undefined}
              disabled={!isOwner}
              className={`rounded-2xl border ${
                !isOwner ? "" : ""
              }`}
            />
          )}
        </main>
      </div>
    </div>
  );
}
