import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API = import.meta.env.VITE_BACKEND_URL;

export default function ProfessionalCard({ providerId }) {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerId) return;

    async function fetchProvider() {
      try {
        const res = await axios.get(
          `${API}/api/provider/profile/${providerId}`
        );
        setProvider(res.data);
      } catch (err) {
        console.error("Failed to load provider", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProvider();
  }, [providerId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading professional...
        </CardContent>
      </Card>
    );
  }

  if (!provider) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Professional not found.
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
              📍 {provider.city}
            </span>

            <Badge
              variant={provider.isAvailable ? "default" : "secondary"}
              className="w-fit mt-1"
            >
              {provider.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div className="bg-muted rounded-xl p-4">
          <p className="text-sm leading-relaxed opacity-80">
            {provider.description || "No description provided."}
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <Button
            onClick={() => navigate(`/profile/${provider.providerId || provider.id}`)}
            className="min-w-[160px]"
          >
            View Profile
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
