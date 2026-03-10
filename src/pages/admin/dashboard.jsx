import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/adminDashboard/sidebar";
import AdminStats from "@/components/adminDashboard/adminStat";
import PendingProvidersTable from "@/components/adminDashboard/pendingProviderTable";
import UserManagementTable from "@/components/adminDashboard/UserManagementTable";
import ServiceCategoryManager from "@/components/adminDashboard/serviceCategory";
import { Button } from "@/components/ui/button";
import AdminDashboardOverview from "@/components/adminDashboard/AdminDashboardOverview";
import PendingProviderServicesTable from "@/components/adminDashboard/PendingProviderServicesTable";
import AdminDashboardInsights from "@/components/adminDashboard/AdminDashboardInsights";
import Header from "@/components/header";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import AdminProfileSection from "@/components/adminDashboard/AdminProfileSection";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dashboardStats, setDashboardStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);

      const response = await fetch(`${API}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setDashboardStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const content = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <AdminStats stats={dashboardStats} loading={statsLoading} />
            <AdminDashboardInsights stats={dashboardStats} loading={statsLoading} />
            <AdminDashboardOverview setActiveTab={setActiveTab} />
          </div>
        );
      case "approval":
        return <PendingProvidersTable />;
      case "users":
        return <UserManagementTable />;
      case "services":
        return <PendingProviderServicesTable />;
      case "settings":
        return <ServiceCategoryManager />;
      case "profile":
        return <AdminProfileSection />;
      default:
        return null;
    }
  }, [activeTab, dashboardStats, statsLoading]);

  const tabTitle = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return "Admin Dashboard";
      case "approval":
        return "Provider Approvals";
      case "users":
        return "User Management";
      case "services":
        return "Provider Services";
      case "settings":
        return "Platform Settings";
      case "profile":
        return "Admin Profile";
      default:
        return "Admin Dashboard";
    }
  }, [activeTab]);

  const isDashboardTab = activeTab === "dashboard";

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-[#0b2540] dark:text-white">
        <div className="flex gap-6 p-6">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex-1">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-colors dark:border-cyan-400/20 dark:bg-[#14314d] dark:shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {tabTitle}
                  </p>

                  {isDashboardTab ? (
                    <>
                      <h1 className="text-4xl font-bold tracking-tight">
                        Welcome back 👋
                      </h1>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                        Last updated: {lastUpdated.toLocaleString()}
                      </p>
                    </>
                  ) : null}
                </div>

                {isDashboardTab ? (
                  <Button
                    onClick={fetchDashboardStats}
                    disabled={statsLoading}
                    className="rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-cyan-400/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
                  >
                    {statsLoading ? "Refreshing..." : "Refresh"}
                  </Button>
                ) : null}
              </div>

              <div className="space-y-6">{content}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}