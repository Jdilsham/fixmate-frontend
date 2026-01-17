// src/pages/admin/AdminDashboard.jsx
import Header from "@/components/header";
import AdminSidebar from "../../components/adminDashboard/sidebar";
import AdminStats from "../../components/adminDashboard/adminStat";
import PendingProvidersTable from "../../components/adminDashboard/pendingProviderTable";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

          <AdminStats />

          <PendingProvidersTable />
        </main>
      </div>
    </div>
  );
}
