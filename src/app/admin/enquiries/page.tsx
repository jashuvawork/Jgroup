"use client";

import { useEffect, useState } from "react";

interface Enquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  type: string;
  status: string;
  createdAt: string;
  business: { name: string } | null;
}

export default function EnquiriesAdminPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    fetch("/api/enquiries").then((r) => r.json()).then(setEnquiries);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-light">Enquiries</h1>
      <p className="mt-1 text-sm text-white/40">{enquiries.length} total enquiries</p>

      <div className="mt-8 space-y-4">
        {enquiries.map((eq) => (
          <div key={eq.id} className="rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{eq.name}</p>
              <span className="text-xs text-white/30">
                {eq.business?.name || "General"} · {new Date(eq.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-white/50">{eq.message}</p>
            <div className="mt-2 flex gap-4 text-xs text-white/30">
              {eq.email && <span>{eq.email}</span>}
              {eq.phone && <span>{eq.phone}</span>}
            </div>
          </div>
        ))}
        {enquiries.length === 0 && (
          <p className="text-center text-white/30">No enquiries yet.</p>
        )}
      </div>
    </div>
  );
}
