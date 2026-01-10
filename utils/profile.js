import axios from "axios";

export async function getUserProfile(role) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    if (role === "SERVICE_PROVIDER") {
      const res = await axios.get("/api/provider/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const p = res.data;

      return {
        id: p.providerId,
        fullName: p.fullName,
        city: p.city,
        description: p.description,
        service: p.skill,
        rating: p.rating,
        verified: p.isVerified,
        available: p.isAvailable,
        profilePicture: p.profileImage,
        services: p.services || [],
        phone: p.phone,
      };
    }

    // CUSTOMER
    const res = await axios.get("/api/customer/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const c = res.data;

    return {
      id: c.id,
      username: `${c.firstName} ${c.lastName}`,
      email: c.email,
      phone: c.phone,
      profilePicture: c.profilePic,
      verified: false,
    };
  } catch (err) {
    console.error("Failed to load profile", err);
    return null;
  }
}