import { jwtDecode } from "jwt-decode";

export function getAuthUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const payload = jwtDecode(token);
  
    if (!payload?.role || !payload?.sub) return null;

    return {
      userId: payload.sub,
      role: payload.role,
      token,
    };
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}
