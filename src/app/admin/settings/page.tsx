"use client";

import { useEffect, useState } from "react";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSave = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
  };

  const fields = [
    { key: "site_name", label: "Site Name" },
    { key: "tagline", label: "Tagline" },
    { key: "phone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "instagram", label: "Instagram URL" },
    { key: "facebook", label: "Facebook URL" },
    { key: "youtube", label: "YouTube URL" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light">Settings</h1>
      <p className="mt-1 text-sm text-white/40">Global J brand settings</p>

      <div className="mt-8 space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-xs tracking-wider uppercase text-white/40">{field.label}</label>
            <input
              value={settings[field.key] || ""}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
            />
          </div>
        ))}
        <button onClick={handleSave} className="rounded-full bg-white px-8 py-2 text-xs tracking-wider uppercase text-black">
          Save Settings
        </button>
      </div>
    </div>
  );
}
