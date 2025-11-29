import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/SignupPage";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-[100vh] bg-gray-800 \">
        <Toaster position="top-center" />
        <Routes path="/">
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
