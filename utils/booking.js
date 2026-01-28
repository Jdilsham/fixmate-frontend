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
