import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {session && (
        <header className="border-b border-white/5 bg-zinc-900/50">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-light tracking-[0.2em]">
                J Admin
              </Link>
              <nav className="hidden gap-6 md:flex">
                {[
                  { href: "/admin", label: "Dashboard" },
                  { href: "/admin/businesses", label: "Businesses" },
                  { href: "/admin/enquiries", label: "Enquiries" },
                  { href: "/admin/impact", label: "Impact Stats" },
                  { href: "/admin/settings", label: "Settings" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs tracking-wider uppercase text-white/50 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40">{session.user?.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button type="submit" className="text-xs tracking-wider uppercase text-white/40 hover:text-white">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
