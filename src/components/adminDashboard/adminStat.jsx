import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { Users, ShieldCheck, Clock, Calendar } from "lucide-react";
import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="p-4 h-24 animate-pulse bg-muted/20 border-none"
          />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Providers",
      value: stats.totalProviders || 0,
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals || 0,
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Active Bookings",
      value: stats.activeBookings || 0,
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card
          key={stat.label}
          className="p-5 rounded-2xl border bg-card hover:shadow-sm transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-1">
                {stat.value.toLocaleString()}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
