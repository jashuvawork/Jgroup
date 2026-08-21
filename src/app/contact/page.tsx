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
        className="w-full rounded-full bg-white py-4 text-sm tracking-wider uppercase text-black transition-opacity hover:opacity-90 disabled:opacity-50"
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
    <div className="min-h-screen bg-black">
      <MasterNav />

      <section className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-white/40">Contact</p>
              <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-4xl font-light text-white md:text-5xl">
                Get in Touch
              </h1>
              <div className="mt-10 space-y-6 text-white/50">
                <div>
                  <p className="text-xs tracking-wider uppercase text-white/30">Phone</p>
                  <p className="mt-1 text-white">+91 98765 43210</p>
                </div>
                <div>
                  <p className="text-xs tracking-wider uppercase text-white/30">WhatsApp</p>
                  <a href="https://wa.me/919876543210" className="mt-1 block text-white hover:underline">
                    +91 98765 43210
                  </a>
                </div>
                <div>
                  <p className="text-xs tracking-wider uppercase text-white/30">Email</p>
                  <p className="mt-1 text-white">hello@jbrand.com</p>
                </div>
                <div>
                  <p className="text-xs tracking-wider uppercase text-white/30">Location</p>
                  <p className="mt-1 text-white">Hyderabad, Telangana, India</p>
                </div>
              </div>
            </div>

            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white/5" />}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
