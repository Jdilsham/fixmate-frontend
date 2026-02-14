import { useEffect, useMemo, useState } from "react";
import { PieChart as PieIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Briefcase,
  ClipboardList,
  CheckCircle2,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Bell,
  ShieldCheck,
  MapPin,
  Calendar as CalIcon,
} from "lucide-react";

import { getProviderDashboardSummary } from "../../../utils/booking";

const money = (v) => `Rs. ${Number(v || 0).toLocaleString("en-LK")}`;

const badgeClass = (status) => {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING")
    return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
  if (s === "ACCEPTED")
    return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30";
  if (s === "IN_PROGRESS")
    return "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30";
  if (s === "PAYMENT_PENDING")
    return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30";
  if (s === "COMPLETED")
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  if (s === "REJECTED")
    return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30";
  return "bg-muted text-muted-foreground border-border";
};

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f97316", "#a855f7", "#ec4899"];

function FxCard({ children, className = "", barClassName = "" }) {
  return (
    <Card
      className={[
        "relative overflow-hidden rounded-3xl border",
        "bg-card shadow-[0_16px_55px_-32px_rgba(15,23,42,0.25)]",
        "dark:bg-[#0b141a]/70 dark:border-white/10 dark:shadow-[0_18px_70px_-36px_rgba(0,0,0,0.55)]",
        className,
      ].join(" ")}
    >
      {/* TOP GRADIENT STRIP */}
      <div
        className={[
          "pointer-events-none absolute left-0 top-0 h-[4px] w-full",
          "bg-gradient-to-r from-orange-400 via-sky-500 to-cyan-400",
          "opacity-90 dark:opacity-85",
          barClassName,
        ].join(" ")}
      />

      {/* subtle inner top highlight (makes it look like your screenshot) */}
      <div className="pointer-events-none absolute inset-x-0 top-[4px] h-10 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5" />

      {/* content */}
      <div className="relative">{children}</div>
    </Card>
  );
}

function Tip({ label, value, icon: Icon }) {
  return (
    <FxCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
        </div>

        <div className="h-11 w-11 rounded-2xl border bg-muted/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </FxCard>
  );
}

function BookingTable({ title, subtitle, rows, onViewAll }) {
  return (
    <FxCard className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <Button
          variant="fixmateOutline"
          size="sm"
          className="rounded-xl"
          onClick={onViewAll}
        >
          View all
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border bg-background/30 overflow-hidden">
        <div className="grid grid-cols-[120px_1fr_1fr_120px] gap-3 px-4 py-3 text-xs font-semibold text-muted-foreground border-b bg-muted/10">
          <div>Time</div>
          <div>Customer</div>
          <div>Service</div>
          <div className="text-right">Status</div>
        </div>

        {rows.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold">No bookings</p>
            <p className="text-sm text-muted-foreground mt-1">
              Nothing scheduled here yet.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {rows.map((b) => (
              <div
                key={b.bookingId}
                className="grid grid-cols-[120px_1fr_1fr_120px] gap-3 px-4 py-3 hover:bg-background/50 transition"
              >
                <div className="text-sm font-semibold">
                  {b.scheduledAt
                    ? new Date(b.scheduledAt).toLocaleTimeString("en-LK", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {b.customerName || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {b.city || "—"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {b.serviceTitle || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {b.address || "—"}
                  </p>
                </div>

                <div className="flex items-center justify-end">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeClass(
                      b.status
                    )}`}
                  >
                    {String(b.status || "—").replaceAll("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{rows.length}</span>{" "}
            bookings
          </span>
          <span className="text-muted-foreground">
            Total amount:{" "}
            <span className="font-semibold text-foreground">
              {money(rows.reduce((sum, r) => sum + Number(r.amount || 0), 0))}
            </span>
          </span>
        </div>
      )}
    </FxCard>
  );
}

export default function ProviderDashboardOverview({
  onGoManageBookings,
  onGoServices,
  onGoProfile,

}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await getProviderDashboardSummary();
      setData(res);
      setLastUpdated(new Date());
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const list = data?.earningsLast6Months || [];
    return list.map((x) => ({
      month: x.month,
      total: Number(x.total || 0),
      label: x.month?.slice(5) ? x.month.slice(5) : x.month,
    }));
  }, [data]);

  useEffect(() => {
    loadDashboard();
  }, []);

  if (err && !loading) {
    return (
      <FxCard className="p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl border bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <p className="text-lg font-semibold">Dashboard failed to load</p>
            <p className="text-sm text-muted-foreground mt-1">{err}</p>
            <Button
              variant="fixmateOutline"
              className="rounded-2xl mt-4"
              onClick={loadDashboard}
            >
              Retry
            </Button>
          </div>
        </div>
      </FxCard>
    );
  }

  const alerts = data?.alerts || {};
  const profile = data?.profileHealth || {};
  const today = data?.todayBookings || [];
  const upcoming = data?.upcomingBookings || [];

  const completed = Number(data?.completedJobs || 0);
  const active = Number(data?.activeJobs || 0);
  const total = Number(data?.totalBookings || 0);
  const other = Math.max(0, total - (completed + active));

  const pieData = [
    { name: "Completed", value: completed },
    { name: "Active", value: active },
    { name: "Other", value: other },
  ].filter((x) => x.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Provider Dashboard</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleString("en-LK")}`
              : "Loading latest data..."}
          </p>
        </div>

        <Button
          variant="fixmateOutline"
          className="rounded-2xl"
          onClick={loadDashboard}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[92px] rounded-3xl border bg-muted/20 animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="h-[360px] rounded-3xl border bg-muted/20 animate-pulse" />
            <div className="h-[360px] rounded-3xl border bg-muted/20 animate-pulse" />
          </div>

          <div className="h-[420px] rounded-3xl border bg-muted/20 animate-pulse" />
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <Tip label="Total bookings" value={data?.totalBookings ?? 0} icon={ClipboardList} />
            <Tip label="Active jobs" value={data?.activeJobs ?? 0} icon={Briefcase} />
            <Tip label="Completed" value={data?.completedJobs ?? 0} icon={CheckCircle2} />
            <Tip label="Month income" value={money(data?.monthIncome)} icon={Wallet} />
            <Tip label="Year income" value={money(data?.yearIncome)} icon={TrendingUp} />
          </div>

          {/* Chart + Alerts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Earnings */}
            <FxCard className="p-6 overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">Earnings</p>
                  <p className="text-sm text-muted-foreground">
                    Last 6 months (confirmed payments)
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Lifetime</p>
                  <p className="text-base font-semibold">
                    {money(data?.lifetimeIncome)}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-[260px] rounded-2xl border bg-background/30 p-3 text-primary">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis dataKey="label" tickMargin={8} />
                    <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} width={40} />
                    <Tooltip
                      formatter={(value) => money(value)}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <defs>
                      <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="currentColor" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>

                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="currentColor"
                      strokeWidth={2}
                      fill="url(#earningsFill)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* ===== Earnings Insights ===== */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">Growth</p>
                <p className="mt-1 text-lg font-semibold text-emerald-600">
                +32% this month
                </p>
            </div>

            <div className="rounded-2xl border bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">Best month</p>
                <p className="mt-1 text-lg font-semibold">
                Feb — Rs. 21,670
                </p>
            </div>

            <div className="rounded-2xl border bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">Next month estimate</p>
                <p className="mt-1 text-lg font-semibold text-blue-600">
                Rs. ~26,000
                </p>
            </div>
            </div>

            {/* ===== Smart Suggestions ===== */}
            <div className="mt-6 rounded-2xl border bg-background/40 p-5">
            <p className="font-semibold mb-2">Boost your earnings</p>

            <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Add more service categories</li>
                <li>• Enable availability on weekends</li>
                <li>• Respond faster to new bookings</li>
            </ul>
            </div>

              {/* Actions */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                    variant="fixmate"
                    onClick={onGoManageBookings}
                    className="w-full rounded-2xl justify-center"
                >
                    Go to Manage Bookings
                </Button>

                <Button
                    variant="fixmateOutline"
                    onClick={onGoServices}
                    className="w-full rounded-2xl justify-center"
                >
                    Add / Manage Services
                </Button>

                <Button
                    variant="fixmateOutline"
                    onClick={onGoProfile}
                    className="w-full rounded-2xl justify-center"
                    >
                    Update Availability
                </Button>
            </div>
            </FxCard>

            {/* Alerts + Pie + Profile */}
            <FxCard className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Alerts */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Things that may need your attention
                      </p>
                    </div>

                    <div className="h-10 w-10 rounded-2xl border bg-muted/20 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border bg-background/40 p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold">New booking requests</p>
                        <p className="text-sm text-muted-foreground">
                          Pending approvals
                        </p>
                      </div>
                      <span className="text-xl font-semibold">
                        {alerts.newRequests ?? 0}
                      </span>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold">Payment pending</p>
                        <p className="text-sm text-muted-foreground">
                          Awaiting customer payment
                        </p>
                      </div>
                      <span className="text-xl font-semibold">
                        {alerts.paymentPending ?? 0}
                      </span>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold">Today jobs</p>
                        <p className="text-sm text-muted-foreground">
                          Scheduled for today
                        </p>
                      </div>
                      <span className="text-xl font-semibold">
                        {alerts.todayJobs ?? 0}
                      </span>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4 flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl border bg-muted/20 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {alerts.verificationPending ? "Verification pending" : "Verified"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {alerts.verificationPending
                            ? "Complete required info and submit verification."
                            : "Your account is approved."}
                        </p>
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">
                            Availability:
                          </span>{" "}
                          <span className="font-semibold">
                            {alerts.availabilityOff ? "OFF" : "ON"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie */}
                <div className="rounded-3xl border bg-background/40 p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Jobs breakdown</p>
                    <div className="h-9 w-9 rounded-2xl border bg-muted/20 flex items-center justify-center">
                      <PieIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="mt-4 h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {pieData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-2 space-y-2 text-sm">
                    {pieData.map((x, i) => (
                      <div key={x.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          <span className="text-muted-foreground">{x.name}</span>
                        </div>
                        <span className="font-semibold">{x.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Health */}
              <div className="mt-6 rounded-3xl border bg-background/40 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Profile health</p>
                  <span className="text-sm font-semibold">
                    {profile.completionPercent ?? 0}%
                  </span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${profile.completionPercent ?? 0}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="rounded-xl border bg-muted/10 px-3 py-2">
                    Services:{" "}
                    <span className="font-semibold text-foreground">
                      {profile.servicesCount ?? 0}
                    </span>
                  </div>
                  <div className="rounded-xl border bg-muted/10 px-3 py-2">
                    Verified:{" "}
                    <span className="font-semibold text-foreground">
                      {profile.verified ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="rounded-xl border bg-muted/10 px-3 py-2">
                    Available:{" "}
                    <span className="font-semibold text-foreground">
                      {profile.available ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="rounded-xl border bg-muted/10 px-3 py-2">
                    Address:{" "}
                    <span className="font-semibold text-foreground">
                      {profile.hasAddress ? "OK" : "Missing"}
                    </span>
                  </div>
                </div>
              </div>
            </FxCard>
          </div>

          {/* Today + Upcoming */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <BookingTable
              title="Today’s bookings"
              subtitle="Quick view of what’s scheduled today"
              rows={today.slice(0, 6)}
              onViewAll={onGoManageBookings}
            />

            <BookingTable
              title="Upcoming"
              subtitle="Next 7 days (scheduled bookings)"
              rows={upcoming.slice(0, 8)}
              onViewAll={onGoManageBookings}
            />
          </div>
        </>
      )}
    </div>
  );
}