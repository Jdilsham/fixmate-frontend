import axios from "axios";
import { getAuthUser } from "./auth";

const API = import.meta.env.VITE_BACKEND_URL;

export const getCustomerPayment = async (bookingId) => {
  const auth = getAuthUser();

  const res = await axios.get(
    `${API}/api/customer/payments/${bookingId}`,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
};

export const initiatePayHereSandbox = async (paymentId) => {
  const auth = getAuthUser();

  const res = await axios.post(
    `${API}/api/customer/payments/pay-here-sandbox/${paymentId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    }
  );

  return res.data;
};