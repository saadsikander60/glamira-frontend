"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  MessageSquare,
  Star,
  Flower2,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
] as const;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#2b0a1a]/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#f3d4e0] bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#f3d4e0] px-5">
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1f4d] to-[#be185d] shadow-sm">
              <Flower2 size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-serif text-lg font-bold text-[#3b1026]">
                Glamira
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#be185d]">
                Admin
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#7a1f4d] hover:bg-[#fdf2f7] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9f6b82]">
            Management
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
                    ? "bg-gradient-to-r from-[#7a1f4d] to-[#be185d] text-white shadow-sm"
                    : "text-[#5c2a40] hover:bg-[#fdf2f7] hover:text-[#be185d]"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#f3d4e0] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#f3d4e0] px-3 py-2.5 text-sm font-semibold text-[#7a1f4d] transition hover:bg-[#fdf2f7] hover:text-[#be185d]"
          >
            <LogOut size={16} />
            Logout
          </button>
          <p className="mt-3 text-center text-xs text-[#9f6b82]">
            Glamira Essence Admin Portal
          </p>
        </div>
      </aside>
    </>
  );
}
