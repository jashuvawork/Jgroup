import Link from "next/link";
import { CONTACT } from "@/lib/contact";

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
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#030303]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 bg-gradient-to-b from-violet-500/5 to-transparent blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-20 text-center">
          <p className="font-[family-name:var(--font-cinzel)] text-7xl font-medium tracking-[0.4em] text-gradient-gold md:text-8xl">
            J
          </p>
          <div className="mx-auto mt-6 flex flex-col items-center gap-2">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">
              One Vision. Many Possibilities.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-[10px] tracking-[0.2em] uppercase text-white/35 transition-colors duration-300 hover:text-white/80"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="section-divider mx-auto mt-16 max-w-xs" />

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <a
            href={CONTACT.whatsappUrl}
            className="text-sm tracking-wider text-white/50 transition-colors hover:text-amber-400/80"
          >
            WhatsApp {CONTACT.phone}
          </a>
          <a
            href={CONTACT.phoneTel}
            className="text-xs tracking-wider text-white/35 transition-colors hover:text-white/60"
          >
            {CONTACT.phone}
          </a>
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-wider text-white/35 transition-colors hover:text-white/60"
          >
            {CONTACT.instagramHandle}
          </a>
        </div>

        <div className="section-divider mx-auto mt-10 max-w-xs" />

        <div className="mt-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[10px] tracking-wider text-white/20">
            &copy; {new Date().getFullYear()} J Brand Ecosystem
          </p>
          <div className="flex gap-8">
            {["Instagram", "Facebook", "YouTube"].map((social) => (
              <span
                key={social}
                className="cursor-pointer text-[10px] tracking-[0.15em] uppercase text-white/25 transition-colors duration-300 hover:text-amber-400/60"
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
