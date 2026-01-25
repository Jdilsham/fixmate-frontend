import axios from "axios";
import { getAuthUser } from "./auth";

const API = import.meta.env.VITE_BACKEND_URL;

export const getProviderBookings = async(providerId) => {
    const auth = getAuthUser();

    const res = await axios.get(`${API}/api/provider/${providerId}/bookings` , {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        
        },
    });
    return res.data;

}

export const getCustomerBookings = async () => {
    const auth = getAuthUser();

    const res = await axios.get(`${API}/api/customer/bookings`, {
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
    });

    return res.data;
};
