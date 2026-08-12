"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  Package,
  MapPin,
  Star,
  ShoppingCart,
  Store,
  Flower2,
  X,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

const navItems = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Profile", href: "/account/profile", icon: UserRound },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "My Addresses", href: "/account/addresses", icon: MapPin },
  { label: "My Reviews", href: "/account/reviews", icon: Star },
  { label: "Support Chat", href: "/account/support", icon: MessageCircle },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Continue Shopping", href: "/products", icon: Store },
] as const;

interface AccountSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AccountSidebar({ open, onClose }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { userUnread } = useSocket();

  const isActive = (href: string) => {
    if (href === "/account") return pathname === "/account";
    if (href === "/cart" || href === "/products") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#2b0a1a]/50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/20 bg-[#3b1026]/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/15 px-5">
          <Link href="/account" onClick={onClose} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1f4d] to-[#be185d] shadow-sm">
              <Flower2 size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-serif text-lg font-bold text-white">Glamira</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-pink-200">
                My Account
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-pink-100 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-white/15 px-5 py-4">
          <p className="text-sm font-semibold text-white">{user?.name || "Customer"}</p>
          <p className="truncate text-xs text-pink-200">{user?.email}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-200/80">
            Account
          </p>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white text-[#be185d] shadow-sm"
                    : "text-pink-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{label}</span>
                {href === "/account/support" && userUnread > 0 ? (
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold ${
                      active
                        ? "bg-[#be185d] text-white"
                        : "bg-white text-[#be185d]"
                    }`}
                  >
                    {userUnread > 99 ? "99+" : userUnread}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/15 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2.5 text-sm font-semibold text-pink-100 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
