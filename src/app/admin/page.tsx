import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const [
    totalBusinesses,
    totalOrders,
    eventEnquiries,
    totalCustomers,
    totalEnquiries,
    foundationProjects,
    businesses,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.order.count(),
    prisma.eventBooking.count(),
    prisma.customer.count(),
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.foundationProject.count(),
    prisma.business.findMany({ include: { theme: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const stats = [
    { label: "Total Businesses", value: totalBusinesses },
    { label: "Total Orders", value: totalOrders },
    { label: "Event Enquiries", value: eventEnquiries },
    { label: "Foundation Projects", value: foundationProjects },
    { label: "Customers", value: totalCustomers },
    { label: "New Enquiries", value: totalEnquiries },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light">J Overview</h1>
      <p className="mt-1 text-sm text-white/40">Master brand ecosystem dashboard</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/5 bg-white/5 p-6">
            <p className="text-3xl font-light">{formatNumber(stat.value)}</p>
            <p className="mt-1 text-xs tracking-wider uppercase text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-lg font-light">J World Directory</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs tracking-wider uppercase text-white/40">
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Route</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz) => (
              <tr key={biz.id} className="border-b border-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: biz.theme?.primaryColor || "#fff" }}
                    />
                    {biz.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-white/50">{biz.category}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${biz.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {biz.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/50">{biz.route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
