// src/components/admin/AdminStats.jsx
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Total Users", value: "1,248" },
  { label: "Providers", value: "342" },
  { label: "Pending Approvals", value: "18" },
  { label: "Active Bookings", value: "96" },
];

export default function AdminStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="p-4 rounded-2xl border bg-muted/30"
        >
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
