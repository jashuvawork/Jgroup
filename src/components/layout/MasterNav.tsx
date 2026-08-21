"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const masterLinks = [
  { href: "/#explore", label: "Explore J" },
  { href: "/about", label: "About" },
  { href: "/#explore", label: "Our Worlds" },
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
  const links = businessNav || masterLinks;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent"
          : "bg-black/60 backdrop-blur-xl border-b border-white/5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <span className="text-2xl font-light tracking-[0.3em] text-white transition-all group-hover:tracking-[0.4em]">
            J
          </span>
          {businessName && (
            <span
              className="hidden text-xs tracking-widest uppercase opacity-60 sm:block"
              style={{ color: businessColor }}
            >
              {businessName}
            </span>
          )}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-xs tracking-[0.2em] uppercase text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-white/70"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-black/90 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {links.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.15em] uppercase text-white/70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
