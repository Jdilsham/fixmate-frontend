import axios from "@/lib/axios";

export async function getAuthUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await axios.get("/api/provider/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // real profile data
  } catch (err) {
    console.error("Failed to load provider profile", err);
    localStorage.removeItem("token");
    return null;
  }
}
