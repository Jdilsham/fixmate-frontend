export default function Footercard() {
  return (
    <footer className="w-full px-4 sm:px-6">
      {/* Glass container */}
      <div
        className="
          max-w-7xl mx-auto
          rounded-3xl
          bg-white/40 dark:bg-white/5
          backdrop-blur-xl
          border border-black/10 dark:border-white/10
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          px-10 pt-16
        "
      >
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Logo */}
          <div className="space-y-6">
            <img
              src="/image.png"
              className="w-56"
              alt="FixMate logo"
            />
            <p className="text-lg opacity-80 leading-relaxed">
              FixMate connects you with verified professionals for reliable,
              stress-free services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="hidden lg:block">
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {["Home", "Services", "Wanted", "About Us", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`/${
                        item === "Home"
                          ? ""
                          : item.toLowerCase().replace(" ", "")
                      }`}
                      className="opacity-75 hover:opacity-100 hover:text-[#F66B0E] transition"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Popular */}
          <div className="hidden lg:block">
            <h3 className="text-xl font-semibold mb-6">Popular</h3>
            <ul className="space-y-4 opacity-75">
              {[
                "Electricians",
                "Plumbers",
                "Carpenters",
                "Color Wash",
                "Mechanics",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact</h3>
            <div className="space-y-4 opacity-75">
              <div className="flex items-center gap-4">
                <img src="/mail.png" className="w-6" alt="" />
                <span>support@fixmate.lk</span>
              </div>
              <div className="flex items-center gap-4">
                <img src="/contact-black.png" className="w-6" alt="" />
                <span>+94 71 234 5678</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-black/10 dark:border-white/10 text-center text-sm opacity-70">
          © 2025 FixMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
