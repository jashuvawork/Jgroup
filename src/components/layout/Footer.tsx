import Link from "next/link";

export function Footer() {
  const links = [
    { href: "/#explore", label: "Explore J" },
    { href: "/j-foods", label: "J Foods" },
    { href: "/j-surprise-events", label: "J Surprise Events" },
    { href: "/j-foundation", label: "J Foundation" },
    { href: "/about", label: "About J" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <p className="text-6xl font-extralight tracking-[0.5em] text-white md:text-8xl">
            J
          </p>
          <p className="mt-4 text-xs tracking-[0.3em] uppercase text-white/40">
            One Vision. Many Possibilities.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.15em] uppercase text-white/50 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-8">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} J Brand Ecosystem. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Instagram", "Facebook", "YouTube"].map((social) => (
              <span
                key={social}
                className="text-xs tracking-wider uppercase text-white/30 hover:text-white/60 cursor-pointer transition-colors"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
