import axios from "axios";
import { getAuthUser } from "./auth";

const API = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = () => {
  const auth = getAuthUser();

  if (!auth?.token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${auth.token}`,
  };
};

export const buildAdminAssetUrl = (filePath) => {
  if (!filePath) return null;

  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://") ||
    filePath.startsWith("data:")
  ) {
    return filePath;
  }

  return `${API.replace(/\/$/, "")}/${filePath.replace(/^\//, "")}`;
};

// Dashboard
export const getAdminStats = async () => {
  const res = await axios.get(`${API}/api/admin/stats`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Users
export const getAdminUsers = async () => {
  const res = await axios.get(`${API}/api/admin/users`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const toggleBanUser = async (userId) => {
  const res = await axios.patch(
    `${API}/api/admin/users/${userId}/toggle-ban`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

// Pending Providers
export const getPendingProviders = async () => {
  const res = await axios.get(`${API}/api/admin/providers/pending`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const approveProvider = async (providerId) => {
  const res = await axios.put(
    `${API}/api/admin/providers/${providerId}/approve`,
    {},
    {
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

export const rejectProvider = async (providerId, reason) => {
  const res = await axios.put(
    `${API}/api/admin/providers/${providerId}/reject`,
    reason || "",
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    },
  );
  return res.data;
};

export const getProviderDetails = async (providerId) => {
  const res = await axios.get(`${API}/api/admin/providers/${providerId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Provider Services
export const getPendingProviderServices = async () => {
  const res = await axios.get(`${API}/api/admin/provider-services/pending`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const verifyProviderService = async (providerServiceId, status) => {
  const res = await axios.put(
    `${API}/api/admin/provider-services/${providerServiceId}/verify`,
    null,
    {
      params: { status },
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

// Categories
export const getAdminCategories = async () => {
  const res = await axios.get(`${API}/api/admin/categories`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createAdminCategory = async (payload) => {
  const res = await axios.post(`${API}/api/admin/categories`, payload, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const updateAdminCategory = async (id, payload) => {
  const res = await axios.put(`${API}/api/admin/categories/${id}`, payload, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const deleteAdminCategory = async (id) => {
  const res = await axios.delete(`${API}/api/admin/category/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};