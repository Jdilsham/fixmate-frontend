import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Users, ShieldCheck, Clock, Calendar, Wallet } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminStats({ onStatsLoaded }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
        onStatsLoaded?.(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [onStatsLoaded]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      icon: Users,
    },
    {
      label: "Providers",
      value: stats.totalProviders || 0,
      icon: ShieldCheck,
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals || 0,
      icon: Clock,
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings || 0,
      icon: Calendar,
    },
    {
      label: "Total Earnings",
      value: `Rs. ${Number(stats.totalEarnings || 0).toLocaleString()}`,
      icon: Wallet,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="h-28 rounded-3xl border border-slate-200 bg-white animate-pulse dark:border-cyan-400/15 dark:bg-[#0a2236]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-5 text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)] dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)] transition-colors"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-primary to-cyan-400" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-cyan-400/20 dark:bg-[#0d2a42]">
                <Icon
                  size={20}
                  className="text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
