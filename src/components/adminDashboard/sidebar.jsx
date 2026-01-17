// src/components/admin/AdminSidebar.jsx
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  Settings,
} from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-muted/40 p-4 hidden md:block">
      <h2 className="text-lg font-bold mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem icon={FileCheck} label="Provider Approvals" />
        <SidebarItem icon={Users} label="Users" />
        <SidebarItem icon={Briefcase} label="Services" />
        <SidebarItem icon={Settings} label="Settings" />
      </nav>
    </aside>
  );
}

function SidebarItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-muted">
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
