import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`${API}/api/provider/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT : IDENTITY */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            
            <Avatar className="size-28">
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {profile.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">
                {profile.fullName}
              </h2>

              <p className="text-muted-foreground">
                {profile.skill}
              </p>

              <span className="text-sm opacity-70">
                📍 {profile.city}
              </span>
            </div>

            <Badge variant={profile.isAvailable ? "default" : "secondary"}>
              {profile.isAvailable ? "Available" : "Unavailable"}
            </Badge>

          </CardContent>
        </Card>

        {/* RIGHT : DETAILS */}
        <Card className="md:col-span-2">
          <CardContent className="p-6 flex flex-col gap-6">
            
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                About
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {profile.description || "No description provided."}
              </p>
            </div>

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Services
                </h3>

                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action */}
            <div className="flex justify-end pt-4">
              <Button className="min-w-[180px]">
                Book Service
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
