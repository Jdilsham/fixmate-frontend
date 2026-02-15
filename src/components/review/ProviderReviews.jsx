import { useEffect, useMemo, useState } from "react";
import { Star, Search, Filter, ArrowUpDown, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getProviderReviews, getUserProfile } from "../../../utils/profile";

const safeText = (v) =>
  v === null || v === undefined || String(v).trim() === "" ? "—" : String(v);

const toNum = (v) => Number(v || 0);

const formatDateTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Stars({ value = 0, size = 18 }) {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  const filled = Math.round(v);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={
            n <= filled
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300 dark:text-slate-600"
          }
        />
      ))}
    </div>
  );
}

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
      <div
        className={[
          "pointer-events-none absolute left-0 top-0 h-[4px] w-full",
          "bg-gradient-to-r from-orange-400 via-sky-500 to-cyan-400",
          "opacity-90 dark:opacity-85",
          barClassName,
        ].join(" ")}
      />
      <div className="pointer-events-none absolute inset-x-0 top-[4px] h-10 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5" />
      <div className="relative">{children}</div>
    </Card>
  );
}

const avgRatingFromList = (list) => {
  if (!list || list.length === 0) return 0;
  const sum = list.reduce((s, r) => s + toNum(r.rating), 0);
  return Math.round((sum / list.length) * 10) / 10;
};

export default function ProviderReviews({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [reviews, setReviews] = useState([]);

  // UI state
  const [q, setQ] = useState("");
  const [minRating, setMinRating] = useState("ALL");
  const [sort, setSort] = useState("NEW");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const prof = await getUserProfile();
      const providerId = prof?.id;

      if (!providerId) {
        setReviews([]);
        return;
      }

      const list = await getProviderReviews(providerId);
      setReviews(list || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const avg = avgRatingFromList(reviews);
    const total = reviews?.length || 0;

    const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    (reviews || []).forEach((r) => {
      const rr = Math.round(toNum(r.rating));
      if (rr >= 1 && rr <= 5) buckets[rr] += 1;
    });

    return { avg, total, buckets };
  }, [reviews]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const min = minRating === "ALL" ? 0 : Number(minRating);

    let list = [...(reviews || [])];

    list = list.filter((r) => {
      const ratingOk = toNum(r.rating) >= min;

      if (!query) return ratingOk;

      const customer =
        (r.customerName ||
          r.customerFullName ||
          r.reviewerName ||
          r.userName ||
          r.customer?.fullName ||
          r.customer?.name ||
          "") + "";

      const comment = (r.comment || r.message || r.review || "") + "";

      return (
        ratingOk &&
        (customer.toLowerCase().includes(query) ||
          comment.toLowerCase().includes(query))
      );
    });

    list.sort((a, b) => {
      const ra = toNum(a.rating);
      const rb = toNum(b.rating);

      const da = new Date(a.createdAt || a.reviewedAt || a.date || 0).getTime();
      const db = new Date(b.createdAt || b.reviewedAt || b.date || 0).getTime();

      if (sort === "NEW") return db - da;
      if (sort === "OLD") return da - db;
      if (sort === "HIGH") return rb - ra;
      if (sort === "LOW") return ra - rb;
      return 0;
    });

    return list;
  }, [reviews, q, minRating, sort]);

  if (err && !loading) {
    return (
      <FxCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">Reviews failed to load</p>
            <p className="text-sm text-muted-foreground mt-1">{err}</p>
          </div>
          <Button variant="fixmateOutline" className="rounded-2xl" onClick={load}>
            Retry
          </Button>
        </div>
      </FxCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Provider</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? "Loading reviews..."
              : `${stats.total} review(s) • Avg ${stats.avg} / 5`}
          </p>
        </div>

        <div className="flex gap-2">
          {onBack && (
            <Button
              variant="fixmateOutline"
              className="rounded-2xl"
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <Button
            variant="fixmateOutline"
            className="rounded-2xl"
            onClick={load}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <FxCard className="p-6 xl:col-span-1">
          <p className="text-sm text-muted-foreground">Average rating</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold leading-none">
                {loading ? "—" : stats.avg || "—"}
              </span>
              <span className="text-xl font-semibold text-muted-foreground">
                / 5
              </span>
            </div>
            <Stars value={stats.avg} size={20} />
          </div>

          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((n) => {
              const count = stats.buckets[n] || 0;
              const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={n} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-muted-foreground">{n}★</span>
                  <div className="h-2 flex-1 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </FxCard>

        {/* Filters */}
        <FxCard className="p-6 xl:col-span-2">
          <p className="text-lg font-semibold">Browse reviews</p>
          <p className="text-sm text-muted-foreground">
            Search by customer name or comment, filter by rating, and sort.
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="rounded-2xl border bg-background/30 px-4 py-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search reviews..."
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Min rating */}
            <div className="rounded-2xl border bg-background/30 px-4 py-3 flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="
                  w-full bg-transparent outline-none text-sm
                  text-foreground
                  dark:[color-scheme:dark]
                  focus:outline-none
                "
              >
                <option value="ALL">All ratings</option>
                <option value="5">5★ and up</option>
                <option value="4">4★ and up</option>
                <option value="3">3★ and up</option>
                <option value="2">2★ and up</option>
                <option value="1">1★ and up</option>
              </select>
            </div>

            {/* Sort */}
            <div className="rounded-2xl border bg-background/30 px-4 py-3 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="
                  w-full bg-transparent outline-none text-sm
                  text-foreground
                  dark:[color-scheme:dark]
                  focus:outline-none
                "
              >
                <option value="NEW">Newest first</option>
                <option value="OLD">Oldest first</option>
                <option value="HIGH">Highest rating</option>
                <option value="LOW">Lowest rating</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{stats.total}</span>{" "}
            reviews
          </div>
        </FxCard>
      </div>

      {/* Reviews List */}
      <FxCard className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">All reviews</p>
            <p className="text-sm text-muted-foreground">
              Full comments & ratings
            </p>
          </div>
          <div className="h-10 w-10 rounded-2xl border bg-muted/20 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[92px] rounded-2xl border bg-muted/20 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border bg-background/30">
              <p className="font-semibold">No reviews found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try changing the search or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((r, idx) => {
                const customer =
                  r.customerName ||
                  r.customerFullName ||
                  r.reviewerName ||
                  r.userName ||
                  r.customer?.fullName ||
                  r.customer?.name ||
                  "Customer";

                const when = r.createdAt || r.reviewedAt || r.date;

                return (
                  <div
                    key={r.id || r.reviewId || `${idx}-${customer}`}
                    className="
                      rounded-2xl border
                      bg-white/80 dark:bg-[#0f1e28]
                      border-black/10 dark:border-white/10
                      p-5
                    "
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {safeText(customer)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateTime(when)}
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          <Stars value={r.rating} size={18} />
                          <span className="text-sm font-semibold">
                            {toNum(r.rating).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {r.serviceTitle ? (
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {safeText(r.serviceTitle)}
                            </p>
                            {r.bookingId && (
                              <p className="text-xs text-muted-foreground">
                                Booking #{r.bookingId}
                              </p>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div
                      className="
                        mt-4
                        rounded-2xl border
                        bg-white/70 dark:bg-[#0b1a24]
                        border-black/10 dark:border-white/10
                        p-4
                      "
                    >
                      <p className="text-sm leading-relaxed">
                        {safeText(r.comment || r.message || r.review)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </FxCard>
    </div>
  );
}