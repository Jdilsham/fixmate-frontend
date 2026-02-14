import { useEffect, useMemo, useState } from "react";
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

import { getProviderDashboardSummary } from "@/utils/booking";

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

function Tip({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border bg-background/40 p-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
      </div>

      <div className="h-10 w-10 rounded-2xl border bg-muted/20 flex items-center justify-center">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

function BookingRow({ b, onOpenBooking }) {
  return (
    <div className="rounded-2xl border bg-background/40 p-4 hover:bg-background/60 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold truncate">{b.customerName || "—"}</p>
          <p className="text-sm text-muted-foreground truncate">
            {b.serviceTitle || "—"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted/20 px-2 py-1">
              <CalIcon className="h-3.5 w-3.5" />
              {b.scheduledAt
                ? new Date(b.scheduledAt).toLocaleString("en-LK", {
                    weekday: "short",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </span>

            {(b.city || b.address) && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-muted/20 px-2 py-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate max-w-[320px]">
                  {b.city || ""}{b.city && b.address ? " • " : ""}{b.address || ""}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeClass(b.status)}`}>
            {String(b.status || "—").replaceAll("_", " ")}
          </span>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="text-sm font-semibold">{b.amount == null ? "—" : money(b.amount)}</p>
            {b.paymentStatus && (
              <p className="text-xs text-muted-foreground mt-1">
                Payment: {String(b.paymentStatus).replaceAll("_", " ")}
              </p>
            )}
          </div>

          {onOpenBooking ? (
            <Button
              size="sm"
              variant="fixmateOutline"
              onClick={() => onOpenBooking(b)}
              className="rounded-xl"
            >
              View
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ProviderDashboardOverview({ onGoManageBookings, onGoServices, onGoCalendar }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const chartData = useMemo(() => {
    const list = data?.earningsLast6Months || [];
    return list.map((x) => ({
      month: x.month, // yyyy-MM
      total: Number(x.total || 0),
      label: x.month?.slice(5) ? x.month.slice(5) : x.month, // "MM"
    }));
  }, [data]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await getProviderDashboardSummary();
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setErr(e?.response?.data?.message || e.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[92px] rounded-2xl border bg-muted/20 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-[360px] rounded-3xl border bg-muted/20 animate-pulse" />
          <div className="h-[360px] rounded-3xl border bg-muted/20 animate-pulse" />
        </div>
        <div className="h-[420px] rounded-3xl border bg-muted/20 animate-pulse" />
      </div>
    );
  }

  if (err) {
    return (
      <Card className="rounded-3xl border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl border bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <p className="text-lg font-semibold">Dashboard failed to load</p>
            <p className="text-sm text-muted-foreground mt-1">{err}</p>
          </div>
        </div>
      </Card>
    );
  }

  const alerts = data?.alerts || {};
  const profile = data?.profileHealth || {};
  const today = data?.todayBookings || [];
  const upcoming = data?.upcomingBookings || [];

  return (
    <div className="space-y-6">
      {/* ========= TOP KPI ROW ========= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Tip label="Total bookings" value={data?.totalBookings ?? 0} icon={ClipboardList} />
        <Tip label="Active jobs" value={data?.activeJobs ?? 0} icon={Briefcase} />
        <Tip label="Completed" value={data?.completedJobs ?? 0} icon={CheckCircle2} />
        <Tip label="Month income" value={money(data?.monthIncome)} icon={Wallet} />
        <Tip label="Year income" value={money(data?.yearIncome)} icon={TrendingUp} />
      </div>

      {/* ========= CHART + ALERTS ========= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Earnings chart */}
        <Card className="rounded-3xl border bg-card p-6 overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Earnings</p>
              <p className="text-sm text-muted-foreground">
                Last 6 months (confirmed payments)
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Lifetime</p>
              <p className="text-base font-semibold">{money(data?.lifetimeIncome)}</p>
            </div>
          </div>

          <div className="mt-5 h-[260px] rounded-2xl border bg-background/30 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="label" tickMargin={8} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} width={40} />
                <Tooltip
                  formatter={(value) => money(value)}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  strokeWidth={2}
                  fillOpacity={0.25}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Small actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="fixmate"
              className="rounded-2xl"
              onClick={onGoManageBookings}
            >
              Go to Manage Bookings
            </Button>

            <Button
              variant="fixmateOutline"
              className="rounded-2xl"
              onClick={onGoServices}
            >
              Add / Manage Services
            </Button>

            <Button
              variant="fixmateOutline"
              className="rounded-2xl"
              onClick={onGoCalendar}
            >
              Update Availability
            </Button>
          </div>
        </Card>

        {/* Alerts + profile status */}
        <Card className="rounded-3xl border bg-card p-6">
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
                <p className="text-sm text-muted-foreground">Pending approvals</p>
              </div>
              <span className="text-xl font-semibold">{alerts.newRequests ?? 0}</span>
            </div>

            <div className="rounded-2xl border bg-background/40 p-4 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-semibold">Payment pending</p>
                <p className="text-sm text-muted-foreground">Awaiting customer payment</p>
              </div>
              <span className="text-xl font-semibold">{alerts.paymentPending ?? 0}</span>
            </div>

            <div className="rounded-2xl border bg-background/40 p-4 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-semibold">Today jobs</p>
                <p className="text-sm text-muted-foreground">Scheduled for today</p>
              </div>
              <span className="text-xl font-semibold">{alerts.todayJobs ?? 0}</span>
            </div>

            {/* verification / availability */}
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
                  <span className="text-muted-foreground">Availability:</span>{" "}
                  <span className="font-semibold">
                    {alerts.availabilityOff ? "OFF" : "ON"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Profile health */}
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
                Services: <span className="font-semibold text-foreground">{profile.servicesCount ?? 0}</span>
              </div>
              <div className="rounded-xl border bg-muted/10 px-3 py-2">
                Verified: <span className="font-semibold text-foreground">{profile.verified ? "Yes" : "No"}</span>
              </div>
              <div className="rounded-xl border bg-muted/10 px-3 py-2">
                Available: <span className="font-semibold text-foreground">{profile.available ? "Yes" : "No"}</span>
              </div>
              <div className="rounded-xl border bg-muted/10 px-3 py-2">
                Address: <span className="font-semibold text-foreground">{profile.hasAddress ? "OK" : "Missing"}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ========= TODAY + UPCOMING ========= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-lg font-semibold">Today’s bookings</p>
          <p className="text-sm text-muted-foreground">
            Quick view of what’s scheduled today
          </p>

          <div className="mt-4 space-y-3">
            {today.length === 0 ? (
              <div className="rounded-2xl border bg-muted/10 p-10 text-center">
                <p className="font-semibold">No bookings today</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You’re free today — check upcoming bookings.
                </p>
              </div>
            ) : (
              today.slice(0, 6).map((b) => <BookingRow key={b.bookingId} b={b} />)
            )}
          </div>
        </Card>

        <Card className="rounded-3xl border bg-card p-6">
          <p className="text-lg font-semibold">Upcoming</p>
          <p className="text-sm text-muted-foreground">
            Next 7 days (scheduled bookings)
          </p>

          <div className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <div className="rounded-2xl border bg-muted/10 p-10 text-center">
                <p className="font-semibold">No upcoming bookings</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add services and keep availability ON to get more requests.
                </p>
              </div>
            ) : (
              upcoming.slice(0, 8).map((b) => <BookingRow key={b.bookingId} b={b} />)
            )}
          </div>
        </Card>
      </div>

      {/* Ratings preview intentionally hidden*/}
    </div>
  );
}