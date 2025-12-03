import { href, Navigate, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100px] flex  ">
      <div className="w-[calc(60%)] h-[80px]  text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-25 ">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/wanted">Wanted</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>
      <div className="w-[calc(40%)] h-[80px]  text-[28px] font-medium text-[#101010] flex justify-center items-center space-x-8 ">
        <a href="/login">Login</a>
        <button
          // onClick={}
          className="w-[150px] h-[41px]    backdrop-blur-xl rounded-[20px] flex justify-center items-center text-[28px] font-medium text-[#101010]"
        >
          signup
        </button>
        <button>theme</button>
      </div>
    </div>
  );
}
