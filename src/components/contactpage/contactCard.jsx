export default function ContactCard({ icon, title, value }) {
  return (
    <div className="w-[260px] h-[180px] bg-card rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center gap-2 hover:shadow-md transition">
      <div className="h-12 w-12 rounded-2xl bg-accent/10 border border-border flex items-center justify-center">
        <img src={icon} alt={title} className="w-7 h-7" />
      </div>

      <p className="text-[18px] font-semibold text-primary">{title}</p>
      <p className="text-[14px] text-muted-foreground text-center px-3">
        {value}
      </p>
    </div>
  );
}