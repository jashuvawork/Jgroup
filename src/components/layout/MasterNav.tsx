"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const masterLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
  { href: "/explore", label: "Our Worlds" },
  { href: "/contact", label: "Contact" },
];

interface MasterNavProps {
  transparent?: boolean;
  businessNav?: { href: string; label: string }[];
  businessName?: string;
  businessColor?: string;
}

export function MasterNav({
  transparent = false,
  businessNav,
  businessName,
  businessColor,
}: MasterNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = businessNav || masterLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = !transparent || scrolled;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        isSolid
          ? "border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-2xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-[family-name:var(--font-cinzel)] text-2xl font-medium tracking-[0.25em] text-gradient-gold transition-all duration-500 group-hover:tracking-[0.35em]">
            J
          </span>
          {businessName && (
            <>
              <span className="hidden h-4 w-px bg-white/10 sm:block" />
              <span
                className="hidden text-[10px] tracking-[0.3em] uppercase sm:block"
                style={{ color: businessColor || "rgba(255,255,255,0.4)" }}
              >
                {businessName}
              </span>
            </>
          )}
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="nav-link text-[10px] tracking-[0.25em] uppercase text-white/45 transition-colors duration-300 hover:text-white/90"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="text-white/60 transition-colors hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/[0.06] bg-[#030303]/95 backdrop-blur-2xl md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-6">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm tracking-[0.15em] uppercase text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
