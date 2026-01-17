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
        profilePicture: p.profileImage
          ? `${API}${p.profileImage}?t=${Date.now()}`
          : null,
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

export async function updateProviderProfile(payload) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not Authenticated");

  const res = await axios.put(
    `${API}/api/provider/profile`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
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

// =======================
// PROVIDER ADDRESS APIs
// =======================

// GET provider address
export async function getProviderAddress() {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.get(
    `${API}/api/provider/address`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data; // null OR address object
}

// ADD provider address
export async function addProviderAddress(address) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.post(
    `${API}/api/provider/address`, 
    address,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

// UPDATE provider address
export async function updateProviderAddress(address) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.put(
    `${API}/api/provider/address`,   
    address,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

export async function updateProviderProfilePicture(file) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("profilePic", file); // MUST match backend param name

  const res = await axios.put(
    `${API}/api/provider/profile/picture`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}
