import axios from "axios";
import { getAuthUser } from "./auth";

const API = import.meta.env.VITE_BACKEND_URL;

export const getProviderBookings = async (providerId) => {
  const auth = getAuthUser();

  const res = await axios.get(
    `${API}/api/provider/${providerId}/bookings`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
};

export const getCustomerBookings = async () => {
  const auth = getAuthUser();

  const res = await axios.get(`${API}/api/customer/bookings`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  return res.data;
};


export const confirmBooking = async (bookingId, providerServiceId) => {
  const auth = getAuthUser();

  if (!auth?.token) {
    throw new Error("Not authenticated");
  }

  const res = await axios.post(
    `${API}/api/provider/bookings/${bookingId}/confirm`,
    null, 
    {
      params: { providerServiceId },
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
};


export const rejectBookingApi = async (bookingId, providerServiceId, reason) => {
  const auth = getAuthUser();

  await axios.post(
    `${API}/api/provider/bookings/${bookingId}/reject`,
    { reason },
    {
      params: { providerServiceId },
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );
};

export const getProviderDashboardSummary = async () => {
  const auth = getAuthUser();

  const res = await axios.get(`${API}/api/provider/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  return res.data;
};

export const getCustomerDashboardSummary = async () => {
  const auth = getAuthUser();

  const res = await axios.get(`${API}/api/customer/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });

  return res.data;
};

export const createSmartBooking = async (payload) => {
  const auth = getAuthUser();

  if (!auth?.token) {
    throw new Error("Not authenticated");
  }

  const res = await axios.post(
    `${API}/api/customer/bookings/smart`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
};


export const getProviderRating = async (providerId) => {
  const auth = getAuthUser();

  const res = await axios.get(
    `${API}/api/reviews/provider/${providerId}/rating`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
};

export const getProviderReviews = async (providerId) => {
  const auth = getAuthUser();

  const res = await axios.get(
    `${API}/api/reviews/provider/${providerId}`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
};