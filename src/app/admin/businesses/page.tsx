"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string | null;
  category: string;
  route: string;
  status: string;
  sortOrder: number;
  heroImage: string | null;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string | null;
    environment3d: string | null;
  } | null;
}

export default function BusinessesAdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    tagline: "",
    category: "general",
    route: "",
    status: "active",
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    environment3d: "custom",
  });
  const router = useRouter();

  useEffect(() => {
    fetch("/api/businesses")
      .then((r) => r.json())
      .then(setBusinesses)
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    await fetch("/api/businesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug,
        route: form.route || `/${slug}`,
        theme: {
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          environment3d: form.environment3d,
        },
      }),
    });
    setShowForm(false);
    const updated = await fetch("/api/businesses").then((r) => r.json());
    setBusinesses(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">Business Management</h1>
          <p className="mt-1 text-sm text-white/40">Add and manage J world businesses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-white px-6 py-2 text-xs tracking-wider uppercase text-black"
        >
          {showForm ? "Cancel" : "Add Business"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-8 space-y-4 rounded-xl border border-white/5 bg-white/5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Business Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white" />
            <input placeholder="Slug (auto-generated)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white" />
            <input placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white">
              <option value="events">Events</option>
              <option value="food">Food</option>
              <option value="foundation">Foundation</option>
              <option value="travel">Travel</option>
              <option value="fashion">Fashion</option>
              <option value="digital">Digital</option>
              <option value="general">General</option>
            </select>
            <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-10 w-full rounded-lg" />
            <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="h-10 w-full rounded-lg" />
          </div>
          <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-white" rows={3} />
          <button type="submit" className="rounded-full bg-white px-8 py-2 text-xs tracking-wider uppercase text-black">Create Business</button>
        </form>
      )}

      <div className="mt-8 grid gap-4">
        {businesses.map((biz) => (
          <div key={biz.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg" style={{ background: `linear-gradient(135deg, ${biz.theme?.primaryColor}, ${biz.theme?.secondaryColor})` }} />
              <div>
                <p className="font-medium">{biz.name}</p>
                <p className="text-xs text-white/40">{biz.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/30">{biz.route}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${biz.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                {biz.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
