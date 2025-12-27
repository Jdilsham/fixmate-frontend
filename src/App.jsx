import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";
import Services from "./pages/services";
import Wanted from "./pages/wanted";
import About from "./pages/about";
import ProfilePage from "./pages/profile";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-[100vh] ">
        <Toaster position="top-center" />
        <Routes path="/">
          <Route path="/" element={<Homepage />} />
          <Route path="/*" element={<h1>404 not found</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/wanted" element={<Wanted />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
