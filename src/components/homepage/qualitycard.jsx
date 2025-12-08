export default function QualityCard({ imgsrc, title, description }) {
  return (
    <div className="w-[350px] h-[270px] bg-[#FFFFFF]  rounded-[10px] drop-shadow-[0_4px_4px_rgba(10,110,255,0.5)] hover:scale-130 transition-all duration-300  ">
      <div className="w-full h-[270px] flex flex-col justify-center items-center text-center ">
        <img className="w-[120px] h-[125px]" src={imgsrc} alt="" />
        <span className="text-[24px] font-semibold pt-4 text-[#4B9EBE]">{title}</span>
        <span className="text-[20px] font-serif pt-4">{description}</span>
      </div>
    </div>
  );
}
