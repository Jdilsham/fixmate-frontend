import { useState, useEffect } from "react";
import Header from "../../components/header";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getAuthUser } from "../../../utils/auth";
import EmployerCard from "../../components/ServicesPage/employerCard";
import {
  Home,
  Calendar as CalendarIcon,
  Settings,
  Briefcase,
} from "lucide-react";
import BookingsTable from "../../components/dashboard/bookingTable";

export default function Dashboard() {
  const authUser = getAuthUser();
  const isProvider = authUser?.role === "SERVICE_PROVIDER";

  const providerTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const customerTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const tabs = isProvider ? providerTabs : customerTabs;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, tabs]);

  const bookings = isProvider
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

  const employerProfile = isProvider
    ? {
        id: authUser.id,
        name: authUser.username,
        service: authUser.service,
        description: authUser.description || "No description provided.",
        location: authUser.location || "Not specified",
      }
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex max-w-9xl mx-auto px-6 pt-8 gap-6">
        {/* SIDEBAR */}
        <aside className="w-64 shrink-0 ">
          <div className="bg-card border rounded-2xl p-4 sticky top-24 h-[calc(100vh-140px)] overflow-auto">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Navigation
              </p>
            </div>

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

        {/* CONTENT (COMPRESSED) */}
        <main className="flex-1 min-w-0">
          <div className="bg-card border rounded-2xl p-6">
            {activeTab === "dashboard" && (
              <>
                <header className="mb-6">
                  <h1 className="text-xl font-semibold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {authUser?.username}
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-background">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-semibold">Rs. 0</p>
                  </Card>
                  <Card className="p-4 bg-background">
                    <p className="text-sm text-muted-foreground">
                      {isProvider ? "Jobs Completed" : "Requests"}
                    </p>
                    <p className="text-2xl font-semibold">0</p>
                  </Card>
                  <Card className="p-4 bg-background">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-semibold">—</p>
                  </Card>
                </div>
                <section className="space-y-4 mt-8">
                  <h3 className="text-lg font-semibold">
                    {isProvider ? "Completed Jobs" : "Your Past Bookings"}
                  </h3>

                  <BookingsTable role={authUser.role} bookings={bookings} />
                </section>
              </>
            )}

            {activeTab === "services" && isProvider && (
              <>
                <h2 className="text-lg font-semibold mb-4">My Services</h2>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2  ">
                  {employerProfile && (
                    <EmployerCard employer={employerProfile} />
                  )}
                </div>
              </>
            )}

            {activeTab === "calendar" && isProvider && (
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

            {activeTab === "settings" && (
              <>
                <h2 className="text-lg font-semibold mb-6">Update Profile</h2>

                <form className="space-y-6 max-w-xl">
                  {/* Skill */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Skill</label>
                    <input
                      type="text"
                      placeholder="e.g. Electrician, Plumber"
                      className="w-full rounded-lg border px-3 py-2 bg-background"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 5"
                      className="w-full rounded-lg border px-3 py-2 bg-background"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <input
                      type="text"
                      placeholder="Street / Area"
                      className="w-full rounded-lg border px-3 py-2 bg-background"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Colombo"
                      className="w-full rounded-lg border px-3 py-2 bg-background"
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full rounded-lg border px-3 py-2 bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      JPG or PNG, max 5MB
                    </p>
                  </div>

                  {/* Actions */}
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
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
