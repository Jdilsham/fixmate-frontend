// src/pages/admin/AdminDashboard.jsx
import Header from "@/components/header";
import AdminSidebar from "../../components/adminDashboard/sidebar";
import AdminStats from "../../components/adminDashboard/adminStat";
import PendingProvidersTable from "../../components/adminDashboard/pendingProviderTable";
import { useState } from "react";
import {
  Briefcase,
  FileCheck,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "approval", label: "Provider Approvals", icon: FileCheck },
  { id: "users", label: "Users", icon: Users },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          <div className=" border rounded-2xl p-6 flex flex-col justify-around ">
            {/* DashBoard */}
            {activeTab === "dashboard" && (
              <>
              <div className="flex flex-col gap-8 ">
                <AdminStats />
              <PendingProvidersTable />
              </div>
              </>
            )
              
            }

            {/* Approvals */}
            {activeTab === "approval" && (
              <>
              
              </>
            )}
          </div>

         
        </main>
      </div>
    </div>
  );
}
