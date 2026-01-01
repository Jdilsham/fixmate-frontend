import { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserAvatar() {
  const [initials, setInitials] = useState("U");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;

        const first =
          user.firstName ||
          user.firstname ||
          user.first_name ||
          "";

        const last =
          user.lastName ||
          user.lastname ||
          user.last_name ||
          "";

        const i = ((first[0] || "") + (last[0] || "")).toUpperCase();

        setInitials(i || "U");
      } catch (err) {
        console.error("Could not fetch user", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Avatar>
      <AvatarFallback className="bg-primary text-primary-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
