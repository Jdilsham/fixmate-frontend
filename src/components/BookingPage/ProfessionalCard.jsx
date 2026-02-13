import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfessionalCard({ service }) {
  if (!service) return null;

  return (
    <Card className="rounded-2xl border border-border bg-card/70 dark:bg-card/50 shadow-lg">
      <CardContent className="p-5 flex flex-col gap-5">
        {/* PROVIDER */}
        <div className="flex items-center gap-4">
          <Avatar className="size-14 ring-2 ring-primary/20">
            <AvatarImage
              src={`${import.meta.env.VITE_BACKEND_URL}${service.providerProfileImage}`}
              alt={service.providerName}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {service.providerName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight truncate">
              {service.providerName}
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Service:</span>{" "}
              <span className="text-foreground font-semibold">
                {service.serviceTitle}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Location:</span>{" "}
              <span className="text-foreground font-semibold">
                {service.location}
              </span>
            </p>
          </div>
        </div>

        {/* PRICE */}
        <div className="rounded-xl bg-muted/35 border border-border px-5 py-4 text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Starting from
          </p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            LKR {service.hourlyRate}
          </p>
          <p className="text-[11px] text-muted-foreground">per hour</p>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fixed Price</span>
            {service.fixedPriceAvailable ? (
              <span className="px-2.5 py-1 rounded-full bg-green-500/15 text-green-600 text-xs font-medium">
                Available
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full border text-xs text-muted-foreground">
                Not Available
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rating</span>
            <span className="italic text-muted-foreground">Not rated yet</span>
          </div>
        </div>

        {/* DESCRIPTION (clamped to avoid tall card) */}
        <div className="rounded-xl bg-muted/25 px-4 py-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {service.serviceDescription ||
            "Professional service delivered with quality workmanship and reliability."}
        </div>
      </CardContent>
    </Card>
  );
}