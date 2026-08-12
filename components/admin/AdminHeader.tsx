"use client";

import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#f3d4e0] bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#7a1f4d] hover:bg-[#fdf2f7] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-[#3b1026] sm:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-[#9f6b82] sm:block">
            Manage your Glamira Essence store
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-[#3b1026]">
            {user?.name || "Admin"}
          </p>
          <p className="text-xs text-[#9f6b82]">{user?.email}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1f4d] to-[#be185d] text-sm font-semibold text-white">
          {(user?.name || "A").charAt(0).toUpperCase()}
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-[#f3d4e0] bg-white px-3 py-2 text-sm font-medium text-[#7a1f4d] transition hover:border-[#be185d] hover:bg-[#fdf2f7] hover:text-[#be185d]"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
