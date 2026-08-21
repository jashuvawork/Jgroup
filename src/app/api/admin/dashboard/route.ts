import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api";

export async function GET() {
  const [
    totalBusinesses,
    totalOrders,
    eventEnquiries,
    foodOrders,
    foundationProjects,
    totalCustomers,
    totalEnquiries,
    recentOrders,
  ] = await Promise.all([
    prisma.business.count(),
    prisma.order.count(),
    prisma.eventBooking.count(),
    prisma.order.count({ where: { business: { category: "food" } } }),
    prisma.foundationProject.count(),
    prisma.customer.count(),
    prisma.enquiry.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { business: true } }),
  ]);

  return jsonResponse({
    totalBusinesses,
    totalOrders,
    eventEnquiries,
    foodOrders,
    foundationProjects,
    totalCustomers,
    totalEnquiries,
    recentOrders,
  });
}
