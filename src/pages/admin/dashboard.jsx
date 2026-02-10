import Header from "@/components/header";
import AdminSidebar from "../../components/adminDashboard/sidebar";
import AdminStats from "../../components/adminDashboard/adminStat";
import PendingProvidersTable from "../../components/adminDashboard/pendingProviderTable";
import { useState } from "react";

import UserManagementTable from "../../components/adminDashboard/UserManagementTable";
import ServiceCategoryManager from "../../components/adminDashboard/serviceCategory";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          <div className="border rounded-2xl p-6">
            
            {activeTab === "dashboard" && <AdminStats />}

            {activeTab === "approval" && <PendingProvidersTable />}

            {activeTab === "users" && <UserManagementTable />}

            {activeTab === "services" && <ServiceCategoryManager />}

            {activeTab === "settings" && <div>Settings coming soon ⚙️</div>}
          
          </div>
        </main>
      </div>
    </div>
  );
}
