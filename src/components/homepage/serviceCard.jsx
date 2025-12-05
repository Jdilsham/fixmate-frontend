export default function ServiceCard({ imgsrc, title }) {
  return (
    <div className="w-[200px] h-[200px] bg-[#FFFFFF] rounded-[20px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.35)] flex flex-col items-center pt-[30px]">
      <img
        src={imgsrc}
        alt="service image not found"
        className="w-[90px] h-[90px]"
      />
      <div className="text-[#000000] text-[24px] font-semibold leading-[29px] pt-[15px] text-center">
        {title}
      </div>
    </div>
  );
}
