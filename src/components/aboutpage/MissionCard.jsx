export default function MissionCard() {
  return (
    <div
      className="
        bg-card
        h-[320px]
        p-6
        rounded-xl
        border border-border
        shadow-md
        hover:shadow-2xl
        transition duration-300 ease-in-out
      "
    >
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Our Mission
      </h3>

      <p className="text-muted-foreground mb-4 leading-relaxed">
        Providing every home with trusted services.
      </p>

      <ul className="space-y-3 text-muted-foreground text-sm">
        <li className="flex items-start gap-3">
          <img
            src="/check.png"
            alt="check"
            className="w-4 h-4 mt-1"
          />
          <span>
            Connect skilled service providers with customers on one platform.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <img
            src="/check.png"
            alt="check"
            className="w-4 h-4 mt-1"
          />
          <span>
            Ensure quality, reliability, and transparency in every service.
          </span>
        </li>

        <li className="flex items-start gap-3">
          <img
            src="/check.png"
            alt="check"
            className="w-4 h-4 mt-1"
          />
          <span>
            Empower professionals by giving them equal access to customers.
          </span>
        </li>
      </ul>
    </div>
  );
}
