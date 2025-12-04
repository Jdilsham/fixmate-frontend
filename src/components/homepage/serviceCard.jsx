export default function ServiceCard({ imgsrc, title }) {
  return (
    <div className="w-[200px] h-[250px] bg-[#FFFFFF] rounded-[20px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col items-center pt-[30px]">
      <img
        src={imgsrc}
        alt="service image not found"
        className="w-[150px] h-[150px]"
      />
      <div className="text-[#000000] text-[24px] font-semibold leading-[29px] pt-[20px]">
        {title}
      </div>
    </div>
  );
}
