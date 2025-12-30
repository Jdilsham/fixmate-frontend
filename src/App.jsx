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


function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-[100vh] ">
        <Toaster position="top-center" />

        <Routes>
          {/* CUSTOMER */}
          <Route path="/" element={<Homepage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/profile/:id" element={<ProfilePage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
