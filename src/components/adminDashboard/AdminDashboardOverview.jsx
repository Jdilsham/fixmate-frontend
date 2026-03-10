import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileCheck,
  Briefcase,
  Settings,
  Shield,
  Bell,
} from "lucide-react";

export default function AdminDashboardOverview({ setActiveTab }) {
  const quickActions = [
    {
      title: "Review Providers",
      desc: "Check pending provider approvals and verify documents.",
      icon: FileCheck,
      action: () => setActiveTab("approval"),
      buttonText: "Open Approvals",
    },
    {
      title: "Manage Users",
      desc: "View platform users and ban or unban accounts.",
      icon: Users,
      action: () => setActiveTab("users"),
      buttonText: "Open Users",
    },
    {
      title: "Verify Services",
      desc: "Approve or reject provider service submissions.",
      icon: Briefcase,
      action: () => setActiveTab("services"),
      buttonText: "Open Services",
    },
    {
      title: "Manage Categories",
      desc: "Create, update, or remove service categories.",
      icon: Settings,
      action: () => setActiveTab("settings"),
      buttonText: "Open Settings",
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="relative overflow-hidden xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)] 
      dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)] transition-colors">    
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-primary to-cyan-400" />

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold">Quick Actions</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
              Frequently used admin tasks
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-cyan-400/20 dark:bg-[#0d2a42]">
            <Bell size={20} className="text-slate-700 dark:text-slate-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-cyan-400/15 dark:bg-[#0d2a42] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-cyan-400/15 dark:bg-[#12324f]">
                    <Icon size={18} className="text-slate-700 dark:text-slate-200" />
                  </div>
                </div>

                <Button
                  onClick={item.action}
                  variant="fixmate"
                  className="mt-4 rounded-full"
                >
                  {item.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-6">
          <Card className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)] 
          dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)] transition-colors">          <div className="flex items-center gap-3 mb-4">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-primary to-cyan-400" />

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-cyan-400/20 dark:bg-[#0d2a42]">
              <Shield size={18} className="text-slate-700 dark:text-slate-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">System Overview</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Admin control center
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 dark:border-cyan-400/10 dark:bg-[#0d2a42] dark:text-slate-200">
              Provider verification is handled from the approvals tab.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 dark:border-cyan-400/10 dark:bg-[#0d2a42] dark:text-slate-200">
              User moderation is available in the users tab.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 dark:border-cyan-400/10 dark:bg-[#0d2a42] dark:text-slate-200">
              Service categories can be managed from settings.
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden rounded-3xl border border-slate-200 
        bg-white p-6 text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)] dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)] transition-colors">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-primary to-cyan-400" />
          
          <h3 className="text-lg font-bold mb-3">Admin Tips</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Review pending providers regularly.</li>
            <li>• Reject incomplete profiles with a clear reason.</li>
            <li>• Keep service categories clean and consistent.</li>
            <li>• Avoid banning users without checking role and reason.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}