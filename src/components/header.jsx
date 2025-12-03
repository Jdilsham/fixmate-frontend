import { href, Navigate, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100px] flex z-96  ">
      <div className="w-[calc(60%)] h-[80px]  text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-25 ">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/services")}>Services</button>
        <button onClick={() => navigate("/wanted")}>Wanted</button>
        <button onClick={() => navigate("/about")}>About</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
      </div>
      <div className="w-[calc(40%)] h-[80px]  text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-8 ">
        <button onClick={() => navigate("/login")}>Login</button>
        <button
          onClick={() => navigate("/signup")}
          className="w-[150px] h-[41px]    backdrop-blur-xl rounded-[20px] flex justify-center items-center text-[28px] font-medium text-[#101010]"
        >
          signup
        </button>
        <button onClick={() => console.log("theme clicked")}>theme</button>
      </div>
    </div>
  );
}
