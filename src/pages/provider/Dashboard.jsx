import { useState, useEffect } from "react";
import Header from "../../components/header";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getAuthUser } from "../../../utils/auth";
import EmployerCard from "../../components/ServicesPage/employerCard";
import BookingsTable from "../../components/dashboard/bookingTable";
import {
  Home,
  Calendar as CalendarIcon,
  Settings,
  Briefcase,
} from "lucide-react";

/* =======================
   ROLE CONFIG
======================= */
const ROLE_CONFIG = {
  SERVICE_PROVIDER: {
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "services", label: "Services", icon: Briefcase },
      { id: "calendar", label: "Calendar", icon: CalendarIcon },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
  USER: {
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
};

export default function Dashboard() {
  const authUser = getAuthUser();

  /* =======================
     NORMALIZE ROLE (CRITICAL)
  ======================= */
  const role = (() => {
    const r = authUser?.role;
    if (!r) return "USER";
    if (r === "SERVICE_PROVIDER" || r === "PROVIDER")
      return "SERVICE_PROVIDER";
    return "USER";
  })();

  const roleConfig = ROLE_CONFIG[role];
  const tabs = roleConfig.tabs;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, tabs]);

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
          id: authUser?.id,
          name: authUser?.username,
          service: authUser?.service,
          description: authUser?.description || "No description provided.",
          location: authUser?.location || "Not specified",
        }
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex max-w-9xl mx-auto px-6 pt-8 gap-6">
        {/* SIDEBAR */}
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

        {/* CONTENT */}
        <main className="flex-1 min-w-0">
          <div className="bg-card border rounded-2xl p-6">
            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <>
                <header className="mb-6">
                  <h1 className="text-xl font-semibold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {authUser?.username}
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <section className="space-y-4 mt-8">
                  <h3 className="text-lg font-semibold">
                    {role === "SERVICE_PROVIDER"
                      ? "Completed Jobs"
                      : "Your Past Bookings"}
                  </h3>

                  <BookingsTable role={role} bookings={bookings} />
                </section>
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

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <>
                <h2 className="text-lg font-semibold mb-6">
                  Update Profile ({role})
                </h2>

                {role === "USER" && (
                  <form className="space-y-4 max-w-xl">
                    <Input label="Full Name" defaultValue={authUser?.username} />
                    <Input label="Phone Number" />
                    <Input label="Address" />
                    <Input label="City" />
                    <Input label="Profile Picture" type="file" />
                    <SaveActions />
                  </form>
                )}

                {role === "SERVICE_PROVIDER" && (
                  <form className="space-y-4 max-w-xl">
                    <Input
                      label="Skill"
                      defaultValue={authUser?.service}
                    />
                    <Input label="Experience (Years)" type="number" />
                    <Input label="Address" />
                    <Input label="City" />
                    <Input label="Profile Picture" type="file" />
                    <SaveActions />
                  </form>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* =======================
   REUSABLE UI
======================= */
function Input({ label, type = "text", defaultValue }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border px-3 py-2 bg-background"
      />
    </div>
  );
}

function SaveActions() {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="submit"
        className="rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground"
      >
        Save Changes
      </button>
      <button
        type="button"
        className="rounded-lg border px-5 py-2 text-sm hover:bg-muted"
      >
        Cancel
      </button>
    </div>
  );
}
