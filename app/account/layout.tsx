"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountHeader from "@/components/account/AccountHeader";

const pageTitles: Record<string, string> = {
  "/account": "Dashboard",
  "/account/profile": "My Profile",
  "/account/orders": "My Orders",
  "/account/addresses": "My Addresses",
  "/account/reviews": "My Reviews",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, loading, isAuthenticated, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!token || !user || !isAuthenticated) {
      setAuthorized(false);
      router.replace("/login");
      return;
    }

    // Admins have the admin portal; keep account usable but nudge cleanly
    if (isAdmin) {
      // Allow access so admins aren't blocked, but they primarily use /admin
      setAuthorized(true);
      return;
    }

    setAuthorized(true);
  }, [loading, token, user, isAuthenticated, isAdmin, router]);

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith("/account/orders/")
      ? "Order Details"
      : Object.entries(pageTitles).find(
          ([path]) => path !== "/account" && pathname.startsWith(path),
        )?.[1]) ||
    "My Account";

  if (loading || !authorized) {
    return (
      <div className="site-bg flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-sm text-pink-100">Verifying account access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="site-bg flex min-h-screen">
      <AccountSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AccountHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
