"use client";

import { useEffect, useState } from "react";

interface ImpactStat {
  key: string;
  label: string;
  value: number;
}

export default function ImpactAdminPage() {
  const [stats, setStats] = useState<ImpactStat[]>([]);

  useEffect(() => {
    fetch("/api/impact-stats").then((r) => r.json()).then(setStats);
  }, []);

  const handleUpdate = async (key: string, value: number, label: string) => {
    await fetch("/api/impact-stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, label }),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-light">Impact Statistics</h1>
      <p className="mt-1 text-sm text-white/40">Manage J Foundation impact numbers</p>

      <div className="mt-8 space-y-4">
        {stats.map((stat) => (
          <div key={stat.key} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex-1">
              <p className="text-sm text-white/40">{stat.label}</p>
              <input
                type="number"
                value={stat.value}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setStats(stats.map((s) => (s.key === stat.key ? { ...s, value: val } : s)));
                }}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-2xl font-light text-white"
              />
            </div>
            <button
              onClick={() => handleUpdate(stat.key, stat.value, stat.label)}
              className="rounded-full bg-white px-6 py-2 text-xs tracking-wider uppercase text-black"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
