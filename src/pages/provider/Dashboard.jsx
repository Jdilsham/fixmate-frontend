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
                  <EmployerCard employer={authUser} />
                  <EmployerCard employer={authUser} />
                  <EmployerCard employer={authUser} />
                  <EmployerCard employer={authUser} />
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
              <h2 className="text-lg font-semibold">Settings</h2>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
