import axios from "axios";
import { getAuthUser } from "./auth";
const API = import.meta.env.VITE_BACKEND_URL;

export async function getUserProfile() {
  const auth = getAuthUser();
  if (!auth){
    console.log("No auth found");
    return null;
  } 

  const { role, token } = auth;
 


  try {
    //SERVICE PROVIDER
    if (role === "SERVICE_PROVIDER") {
      const res = await axios.get(`${API}/api/provider/profile`, {
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
        role,
      };
    }

    
    //CUSTOMER
    if (role === "CUSTOMER") {
      const res = await axios.get(`${API}/api/customer/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      

      const c = res.data;

      return {
        id: c.id,
        fullName: `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone,
        profilePicture: c.profilePic,
        verified: false,
        role,
      };
    }

    //Unknown role
    console.warn("Unknown role:", role);
    return null;
  } catch (err) {
    console.error("Failed to load profile", err);
    return null;
  }
}

export async function updateAvailability(isAvailable) {
  const auth = getAuthUser();
  if(!auth) return null;

  try{
    const res =await axios.patch(`${API}/api/provider/availability`, 
    { isAvailable },
    {
      headers: { Authorization: `Bearer ${auth.token}`,},
    });

    return res.data;
  } catch (err) {
    console.error("Failed to update availability", err);
    throw err;
  }
}

export async function updateProviderProfile(formData) {
  const auth = getAuthUser();
  if(!auth) throw new Error("Not Authenticated");

  try{
    const res = await axios.put(`${API}/api/provider/profile`, formData, {
      headers: { Authorization: `Bearer ${auth.token}`,
      "Content-Type": "multipart/form-data", },
    });

    return res.data;
  } catch (err) {
    console.log("Failed to update profile", err);
    throw err;  
    
  }

}

export async function addCustomerAddress(address) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.post(
    `${API}/api/customer/addresses`,
    address,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
}
