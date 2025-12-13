export default function Footercard() {
  return (
    <footer className="w-full bg-[url('/footer.png')] bg-cover bg-bottom text-black px-10 py-20">
      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-20">
        {/* Logo + Description */}
        <div className="flex flex-col items-start space-y-6">
          <img
            src="/image.png"
            className="w-[405px] h-[120px]"
            alt="fixmate logo not available"
          />
          <p className="text-[24px] leading-relaxed opacity-90">
            FixMate connects you with skilled professionals for reliable
            repairs.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[28px] underline mb-4">Quick Links</h3>
          <ul className="space-y-3">
            {["Home", "Services", "Wanted", "About Us", "Contact Us"].map(
              (item, i) => (
                <li key={i}>
                  <a
                    href={`/${
                      item === "Home" ? "" : item.toLowerCase().replace(" ", "")
                    }`}
                    className="text-[24px] opacity-90 hover:opacity-100 transition"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Popular Links */}
        <div>
          <h3 className="text-[28px] underline mb-4">Popular Links</h3>
          <ul className="space-y-3 text-[24px] opacity-90">
            {[
              "Electricians",
              "Plumbers",
              "Carpenters",
              "Color Wash",
              "Mechanics",
            ].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[28px] underline mb-4">Contact Us</h3>
          <div className="space-y-3 text-[24px] opacity-90">
            <div className="flex items-center space-x-4">
              <img src="/mail.png" className="w-[35px] h-[22px]" alt="" />
              <p>support@fixmate.lk</p>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src="/contact-black.png"
                className="w-[27px] h-[28px]"
                alt=""
              />
              <p>+94 71 234 5678</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-16 pt-6  border-t-4 border-white/20 text-center ">
        <span className="text-[26px]">
          © 2025 Fixmate. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
