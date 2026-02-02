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

        skill: p.skill,
        experience: p.experience,
        description: p.description,

        rating: p.rating,

        verified: p.isVerified,
        verificationStatus: p.verificationStatus,

        idFrontUrl: p.idFrontUrl,
        idBackUrl: p.idBackUrl,
        workPdfUrl: p.workPdfUrl,

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
        profilePicture: c.profilePic
        ? `${API}${c.profilePic}?t=${Date.now()}`
        : null,
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

export async function updateAvailability() {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.patch(
    `${API}/api/provider/availability`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data; // { isAvailable: true/false }
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


export async function updateProfessionalInfo(payload) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.put(
    `${API}/api/provider/professional-info`,
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

// =======================
// PROVIDER ID VERIFICATION
// =======================

export async function uploadIdFront(file) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);

  return axios.put(
    `${API}/api/provider/verification/id-front`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function uploadIdBack(file) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file);

  return axios.put(
    `${API}/api/provider/verification/id-back`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function uploadWorkPdf(file) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("pdf", file);

  const res = await axios.put(
    `${API}/api/provider/verification/pdf`,
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


export async function requestVerification() {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  return axios.post(
    `${API}/api/provider/verify`,
    {},
    {
      headers: { Authorization: `Bearer ${auth.token}` },
    }
  );
}


export const changePassword = async (payload) => {
  const auth = getAuthUser();

  return axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/api/user/change-password`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );
};



export const addProviderService = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/api/provider/services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set Content-Type
    },
    body: formData,
  });

  
  if (!res.ok) {
    const text = await res.text(); 
    throw new Error(text || "Failed to add service");
  }

  
  return await res.text();
};



export async function getProviderServiceCategories() {
  const auth = getAuthUser();

  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/provider/services/categories`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
}

export async function getProviderServices() {
  const auth = getAuthUser();

  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/provider/services`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
}


export async function updateCustomerProfile(payload) {
  const auth = getAuthUser();

  return axios.put(`${API}/api/customer/me`, payload, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
}

// =======================
// CUSTOMER ADDRESS APIs
// =======================

// GET customer address
export async function getCustomerAddress() {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.get(
    `${API}/api/customer/address`,
    {
      headers: { Authorization: `Bearer ${auth.token}` },
    }
  );

  return res.data; // null OR address
}

// ADD customer address
export async function addCustomerAddress(address) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.post(
    `${API}/api/customer/address`,
    address,
    {
      headers: { Authorization: `Bearer ${auth.token}` },
    }
  );

  return res.data;
}

// UPDATE customer address
export async function updateCustomerAddress(address) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const res = await axios.put(
    `${API}/api/customer/address`,
    address,
    {
      headers: { Authorization: `Bearer ${auth.token}` },
    }
  );

  return res.data;
}

//Customer Profile Image Upload
export async function uploadUserProfilePicture(file) {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  const formData = new FormData();
  formData.append("file", file); // MUST be "file"

  const res = await axios.post(
    `${API}/api/user/profile/image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data; // image URL
}


// toggle service active/inactive
export const toggleProviderServiceActive = async (providerServiceId) => {
  const auth = getAuthUser();
  if (!auth) throw new Error("Not authenticated");

  return axios.patch(
    `${API}/api/provider/service/${providerServiceId}/active`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );
};

