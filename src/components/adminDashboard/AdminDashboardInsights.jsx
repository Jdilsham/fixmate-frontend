import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Clock3,
  Wallet,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

const safeNum = (v) => Number(v || 0);

export default function AdminDashboardInsights({ stats }) {
  const totalUsers = safeNum(stats?.totalUsers);
  const totalProviders = safeNum(stats?.totalProviders);
  const pendingApprovals = safeNum(stats?.pendingApprovals);
  const totalBookings = safeNum(stats?.totalBookings);
  const totalEarnings = safeNum(stats?.totalEarnings);

  const providerRatio =
    totalUsers > 0 ? ((totalProviders / totalUsers) * 100).toFixed(1) : "0.0";

  const pendingRate =
    totalProviders > 0
      ? ((pendingApprovals / totalProviders) * 100).toFixed(1)
      : "0.0";

  const earningsPerBooking =
    totalBookings > 0 ? (totalEarnings / totalBookings).toFixed(2) : "0.00";

  const cards = [
    {
      title: "Provider Ratio",
      value: `${providerRatio}%`,
      subtitle: "Providers compared to total users",
      icon: ShieldCheck,
    },
    {
      title: "Pending Approval Rate",
      value: `${pendingRate}%`,
      subtitle: "Pending providers compared to all providers",
      icon: Clock3,
    },
    {
      title: "Avg. Earnings / Booking",
      value: `Rs. ${Number(earningsPerBooking).toLocaleString()}`,
      subtitle: "Average confirmed earnings per booking",
      icon: Wallet,
    },
    {
      title: "Booking Density",
      value: totalUsers > 0 ? (totalBookings / totalUsers).toFixed(2) : "0.00",
      subtitle: "Average bookings per user",
      icon: CalendarDays,
    },
  ];

  return (
    <Card
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 
    shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)]
     dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)] transition-colors"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-primary to-cyan-400" />
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Insights</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Quick system-level indicators calculated from current admin stats
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-cyan-400/20 dark:bg-[#0d2a42]">
          <TrendingUp
            size={20}
            className="text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-cyan-400/10 dark:bg-[#0d2a42] transition-colors"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.title}
                </p>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-cyan-400/15 dark:bg-[#12324f]">
                  <Icon
                    size={18}
                    className="text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {item.value}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
