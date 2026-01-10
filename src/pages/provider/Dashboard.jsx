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

  const user = authUser && profile ? { ...authUser, ...profile } : authUser;

  useEffect(() => {
    if (user?.available !== undefined) {
      setIsAvailable(user.available);
    }
  }, [user]);

  /* LOAD PROFILE */
  useEffect(() => {
    async function loadProfile() {
      const auth = getAuthUser();
      if (!auth) {
        setLoading(false);
        return;
      }

      setAuthUser(auth);
      const profileData = await getUserProfile(auth.role);
      setProfile(profileData);
      setLoading(false);
    }

    loadProfile();
  }, []);

  const role = user?.role;
  const tabs = ROLE_CONFIG[role]?.tabs || [];

  /* TAB VALIDATION */
  useEffect(() => {
    if (tabs.length === 0) return;

    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, tabs]);

  /* SAFE RETURNS */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Session expired. Please login again.</p>
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
                    <p className="text-xl font-semibold">{user?.username}</p>

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
                          onClick={() => setIsAvailable((v) => !v)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isAvailable ? "Yes" : "No"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}