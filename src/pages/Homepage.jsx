import Header from "../components/header";

export default function Homepage() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col bg-[url('/background.jpg')] bg-center  bg-no-repeat">
        <Header />
        <div className="pl-[134px]">
          <img src="/fixmate logo.png" alt="fixmate logo not available" />
        </div>
        <div className="text-[#ffffff] text-[58px] font-semibold leading-[70px] pl-[112px] pt-[327px] absolute">
          Reliable Service,
          <br /> Right at your Doorstep
        </div>
      </div>
      <div className="w-full h-full"></div>
    </div>
  );
}
