import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfessionalCard() {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedProvider");
    if (stored) {
      setProvider(JSON.parse(stored));
    }
  }, []);

  if (!provider) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Professional details not available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center gap-6">
          <Avatar className="size-24">
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {provider.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">
              {provider.fullName}
            </h2>

            <p className="text-muted-foreground">
              {provider.skill}
            </p>

            <span className="text-sm opacity-70">
              📍 {provider.location || provider.city}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-muted rounded-xl p-4">
          <p className="text-sm leading-relaxed opacity-80">
            {provider.description || "No description provided."}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={provider.isAvailable ? "default" : "secondary"}>
            {provider.isAvailable ? "Available" : "Unavailable"}
          </Badge>

          {provider.isVerified && (
            <Badge variant="outline">Verified</Badge>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
