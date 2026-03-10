import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  Settings,
  UserCircle2,
} from "lucide-react";

export default function AdminSidebar({
  activeTab = "dashboard",
  setActiveTab = () => {},
}) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "approval", label: "Provider Approvals", icon: FileCheck },
    { id: "users", label: "Users", icon: Users },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profile", label: "Profile", icon: UserCircle2 },
  ];

  return (
      <aside className="hidden md:block w-64 shrink-0 self-start sticky top-24">
      <div className="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:border-cyan-400/15 dark:bg-[#14314d] dark:shadow-[0_10px_30px_rgba(0,0,0,0.20)] transition-colors">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Navigation
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            Admin Panel
          </h2>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-[0_6px_18px_rgba(249,115,22,0.35)]"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-300"
                  }
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}