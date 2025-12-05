export default function QualityCard({ imgsrc, title, description }) {
  return (
    <div className="w-[350px] h-[270px] bg-[#FFFFFF]  rounded-[10px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] ">
      <div className="w-full h-[270px] flex flex-col justify-center items-center text-center">
        <img className="w-[100px] h-[100px]" src={imgsrc} alt="" />
        <span className="text-[24px] font-semibold pt-4 text-[#4B9EBE]">{title}</span>
        <span className="text-[20px] font-serif pt-4">{description}</span>
      </div>
    </div>
  );
}
