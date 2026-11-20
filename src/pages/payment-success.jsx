import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/provider/dashboard");
    }, 4000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-800">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 dark:text-cyan-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Successful 🎉
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your payment has been completed successfully.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/dashboard/my-bookings")}
          className="w-full py-2 rounded-xl font-medium 
                     bg-gradient-to-r from-green-500 via-green-600 to-green-500 
                     hover:from-green-600 hover:to-green-700 
                     dark:from-cyan-500 dark:via-blue-500 dark:to-teal-500
                     text-white transition-all duration-300"
        >
          Go to My Bookings
        </button>

        {/* Auto redirect text */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          Redirecting automatically...
        </p>
      </div>
    </div>
  );
}