export default function Footercard() {
  return (
    <div className="w-full h-[700px]  bg-[url('/footer.png')] bg-cover bg-bottom flex justify-center items-center flex-col space-y-0">
      <div className="w-full h-[calc(95%)]  space-x-5 flex justify-center items-center pt-30 pl-20 pr-20 text-center">
        <div className="w-[calc(25%)] h-[calc(70%)] flex flex-col justify-center items-center text-center bg-red-500">
          <img src="/fixmate logo.png" className="w-" alt="fixmate logo not available" />
          <span>
            FixMate connects you with skilled professionals for reliable
            repairs.
          </span>
        </div>
        <div className="w-[calc(25%)] h-[calc(70%)] bg-blue-500"></div>
        <div className="w-[calc(25%)] h-[calc(70%)] bg-yellow-500"></div>
        <div className="w-[calc(25%)] h-[calc(70%)] bg-green-500"></div>
      </div>
      <div className="w-full h-[calc(5%)] bg-amber-950   flex flex-col justify-center space-y-10 items-center text-center">
        <hr className="w-[calc(90%)] " />
        <span className="text-[26px] font-Times text-[#ffffff]">
          © 2025 Fixmate. All rights reserved.
        </span>
      </div>
    </div>
  );
}
