import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfessionalCard({ service }) {
  if (!service) return null;

  return (
    <Card className="relative overflow-hidden border border-border/60 shadow-lg">
      
      {/* subtle gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <CardContent className="p-6 md:p-8 flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Provider */}
          <div className="flex items-center gap-5">
            <Avatar className="size-20 ring-2 ring-primary/20">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
                {service.providerName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                {service.providerName}
              </h2>

              <p className="text-muted-foreground text-sm">
                {service.serviceTitle}
              </p>

              <p className="text-sm flex items-center gap-1 opacity-70">
                <span>📍</span>
                <span>{service.location}</span>
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 px-8 py-5 text-center shadow-inner">
            <p className="text-xs uppercase tracking-wide opacity-60 mb-1">
              Starting from
            </p>

            <p className="text-3xl font-bold text-accent">
              LKR {service.hourlyRate}
            </p>

            <p className="text-xs opacity-60 mt-1">
              per hour
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="rounded-2xl bg-muted/60 p-5 leading-relaxed text-sm">
          {service.serviceDescription || "No description provided."}
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full px-4 py-1">
            {service.categoryName}
          </Badge>

          {service.fixedPriceAvailable && (
            <Badge
              variant="outline"
              className="rounded-full px-4 py-1"
            >
              Fixed pricing available
            </Badge>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
