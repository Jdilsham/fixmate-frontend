import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import Services from "./pages/services";
import Wanted from "./pages/wanted";
import About from "./pages/about";
import Contact from "./pages/contact";

import ProfilePage from "./pages/profile";
import ProviderDashboard from "./pages/provider/Dashboard";
import { Toaster } from "react-hot-toast";
import BookProfessional from "./pages/BookProfessional";
import AdminDashboard from "./pages/admin/dashboard";
import PaymentSuccess from "./pages/payment-success";
import PaymentCancel from "./pages/payment-cancel";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen">
        
        <Toaster
          position="top-center"
          containerStyle={{ zIndex: 20000 }}
          toastOptions={{
            style: { zIndex: 20000 },
          }}
        />

        <Routes>
          {/* CUSTOMER */}
          <Route path="/" element={<Homepage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          

          {/* SERVICE PROVIDER */}
          <Route
            path="/provider/dashboard" element={<ProviderDashboard />}
          />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />


          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* OPTIONAL */}
          <Route path="/wanted" element={<Wanted />} />

           {/* BOOKING */}
          <Route path="/book/:providerServiceId" element={<BookProfessional />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
