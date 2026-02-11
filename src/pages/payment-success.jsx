import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Give webhook time to update backend
    setTimeout(() => {
      navigate("/dashboard/my-bookings");
    }, 2000);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>✅ Payment Successful</h2>
      <p>Redirecting back to your bookings...</p>
    </div>
  );
}