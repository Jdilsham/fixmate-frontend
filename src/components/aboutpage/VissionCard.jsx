export default function VisionCard() {
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
        Our Vision
      </h3>

      <p className="text-muted-foreground text-sm leading-relaxed">
        Becoming Sri Lanka’s most trusted home service platform.
        <br /><br />
        Transforming the home services industry through digital
        technology to create a reliable and transparent ecosystem
        that allows service providers and customers to grow
        together while empowering professionals.
      </p>
    </div>
  );
}
