"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MasterNav } from "@/components/layout/MasterNav";
import { Footer } from "@/components/layout/Footer";

const BUSINESS_OPTIONS = [
  { value: "", label: "General J Enquiry" },
  { value: "j-foods", label: "J Foods" },
  { value: "j-surprise-events", label: "J Surprise Events" },
  { value: "j-foundation", label: "J Foundation" },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    business: searchParams.get("business") || "",
    type: searchParams.get("type") || "general",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "", business: "", type: "general" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-xs tracking-wider uppercase text-white/40">
          Which J business?
        </label>
        <select
          value={form.business}
          onChange={(e) => setForm({ ...form, business: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
        >
          {BUSINESS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-black">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs tracking-wider uppercase text-white/40">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-wider uppercase text-white/40">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs tracking-wider uppercase text-white/40">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs tracking-wider uppercase text-white/40">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/30"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-premium w-full rounded-full bg-gradient-to-r from-[#c9a227] via-[#e8d48b] to-[#c9a227] bg-[length:200%_auto] py-4 text-xs tracking-[0.2em] uppercase text-black transition-all hover:shadow-[0_0_30px_rgba(201,162,39,0.25)] disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Enquiry"}
      </button>

      {status === "success" && (
        <p className="text-center text-sm text-green-400">Thank you! We&apos;ll be in touch soon.</p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-400">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030303]">
      <MasterNav />

      <section className="relative px-6 pt-32 pb-24">
        <div className="pointer-events-none absolute left-1/4 top-20 h-[400px] w-[400px] rounded-full bg-violet-600/6 blur-[120px]" />
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-[10px] tracking-[0.45em] uppercase text-amber-400/50">Contact</p>
              <h1 className="mt-4 font-[family-name:var(--font-cinzel)] text-4xl font-medium text-gradient-gold md:text-5xl">
                Get in Touch
              </h1>
              <p className="mt-6 text-white/40">We&apos;d love to hear from you. Select your J business or send a general enquiry.</p>
              <div className="mt-12 space-y-8">
                {[
                  { label: "Phone", value: "+91 98765 43210" },
                  { label: "WhatsApp", value: "+91 98765 43210", href: "https://wa.me/919876543210" },
                  { label: "Email", value: "hello@jbrand.com" },
                  { label: "Location", value: "Hyderabad, Telangana, India" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-white/25">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="mt-1 block text-white/80 transition-colors hover:text-amber-400/80">
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-white/80">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow rounded-2xl p-8">
              <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white/5" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
