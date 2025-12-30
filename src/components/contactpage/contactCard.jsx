export default function ContactCard({ icon, title, value }) {
  return (
    <div className="w-[260px] h-[180px] bg-card rounded-xl drop-shadow-md flex flex-col justify-center items-center gap-2 hover:scale-105 transition">
      <img src={icon} alt={title} className="w-[32px] h-[32px]" />
      <p className="text-[18px] font-semibold text-primary">{title}</p>
      <p className="text-[14px] text-foreground text-center">{value}</p>
    </div>
  );
}
