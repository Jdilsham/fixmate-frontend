import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>❌ Payment Failed</h2>
      <p>You can try again.</p>

      <button
        onClick={() => navigate("/dashboard/my-bookings")}
        style={{ marginTop: "20px" }}
      >
        Back to My Bookings
      </button>
    </div>
  );
}