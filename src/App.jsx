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



function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-screen ">
        <Toaster position="top-center" />

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

          {/* OPTIONAL */}
          <Route path="/wanted" element={<Wanted />} />

           {/* BOOKING */}
          <Route path="/book/:id" element={<BookProfessional />} />


          {/* 404 */}
          <Route path="*" element={<h1>404 not found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
