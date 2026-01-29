import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfessionalCard({ service }) {
  if (!service) return null;

  return (

    <Card className="rounded-2xl border border-border bg-card shadow-xl">
  <CardContent className="p-7 flex flex-col gap-7">

    {/* PROVIDER HERO */}
    <div className="flex items-center gap-5">
      <Avatar className="size-20 ring-2 ring-primary/20">
        <AvatarImage
          src={`${import.meta.env.VITE_BACKEND_URL}${service.providerProfileImage}`}
          alt={service.providerName}
        />
        <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
          {service.providerName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {service.providerName}
        </h2>

        {/* SERVICE */}
        <p className="text-base">
          <span className="font-medium text-muted-foreground">Service:</span>{" "}
          <span className="font-semibold text-foreground">
            {service.serviceTitle}
          </span>
        </p>

        {/* LOCATION */}
        <p className="text-base">
          <span className="font-medium text-muted-foreground">Location:</span>{" "}
          <span className="font-semibold text-foreground">
            {service.location}
          </span>
        </p>
      </div>
    </div>

    {/* PRICE */}
    <div className="rounded-xl bg-muted/40 border border-border px-6 py-5 text-center">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        Starting from
      </p>

      <p className="text-3xl font-bold text-orange-500 mt-1">
        LKR {service.hourlyRate}
      </p>

      <p className="text-xs text-muted-foreground">
        per hour
      </p>
    </div>

    {/* DETAILS */}
    <div className="flex flex-col gap-3">

      {/* FIXED PRICE */}
      <div className="flex items-center justify-between text-base">
        <span className="text-muted-foreground">Fixed Price</span>

        {service.fixedPriceAvailable ? (
          <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-600 text-sm font-medium">
            Available
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full border text-sm text-muted-foreground">
            Not Available
          </span>
        )}
      </div>

      {/* RATING */}
      <div className="flex items-center justify-between text-base">
        <span className="text-muted-foreground">Rating</span>
        <span className="italic text-muted-foreground">
          Not rated yet
        </span>
      </div>

    </div>

    {/* DESCRIPTION */}
    <div className="rounded-xl bg-muted/30 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
      {service.serviceDescription ||
        "Professional service delivered with quality workmanship and reliability."}
    </div>

  </CardContent>
</Card>


  );
}
