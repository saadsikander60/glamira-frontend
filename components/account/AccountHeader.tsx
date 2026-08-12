"use client";

import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AccountHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function AccountHeader({ title, onMenuClick }: AccountHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/15 bg-[#3b1026]/70 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-pink-100 hover:bg-white/10 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-white sm:text-xl">{title}</h1>
          <p className="hidden text-xs text-pink-200 sm:block">
            Your Glamira Essence account
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-white">{user?.name || "Customer"}</p>
          <p className="text-xs text-pink-200">{user?.email}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#be185d]">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
