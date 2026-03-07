import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  Settings,
  ClipboardCheck,
} from "lucide-react";
import { useState } from "react";



export default function AdminSidebar({activeTab = "dashboard", setActiveTab = () => {}}) {

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "approval", label: "Provider Approvals", icon: FileCheck },
    { id: "serviceRequests", label: "Service Requests", icon: ClipboardCheck },
    { id: "users", label: "Users", icon: Users },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-muted/40 p-4 hidden md:block ">
      <h2 className="text-lg font-bold mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              activeTab === tab.id ? "bg-accent" : "hover:bg-accent"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
        
      </nav>
    </aside>
  );
}

