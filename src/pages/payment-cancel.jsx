import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-gray-100 dark:border-gray-800">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Payment Failed ❌
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your payment was not completed. You can try again.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          
          {/* Retry */}
          <button
            onClick={() => navigate("/dashboard/my-bookings")}
            className="w-full py-2 rounded-xl font-medium 
                       bg-gradient-to-r from-red-500 via-red-600 to-red-500 
                       hover:from-red-600 hover:to-red-700 
                       text-white transition-all duration-300"
          >
            Try Again
          </button>

          {/* Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-2 rounded-xl font-medium 
                       border border-gray-300 dark:border-gray-700
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    </div>
  );
}