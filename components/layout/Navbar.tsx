"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Flower2, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, token, logout } = useAuth();

  const [showAbout, setShowAbout] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#3b1026]/95 via-[#7a1f4d]/95 to-[#be185d]/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <Flower2 size={26} className="text-pink-100" />
          </div>

          <span className="text-2xl font-serif font-bold text-white tracking-wide">
            Glamira Essence
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center w-64 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <input
            type="text"
            placeholder="Search beauty products..."
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/60"
          />

          <button
            type="button"
            className="w-9 h-9 shrink-0 rounded-full bg-pink-200 text-[#7a1f4d] flex items-center justify-center hover:bg-white transition"
          >
            <Search size={16} />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Login / Profile */}
          {token ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="h-10 px-5 rounded-full bg-white text-[#be185d] font-semibold flex items-center gap-2 hover:bg-pink-100 transition"
              >
                <User size={18} />

                <span className="hidden xl:block">
                  {user?.name || "Account"}
                </span>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="h-10 w-10 rounded-full bg-white text-[#be185d] flex items-center justify-center hover:bg-pink-100 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="h-10 px-5 rounded-full bg-white text-[#be185d] font-semibold flex items-center justify-center hover:bg-pink-100 transition"
            >
              Login
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative h-10 px-5 rounded-full bg-white text-[#be185d] font-semibold flex items-center gap-2 hover:bg-pink-100 transition"
          >
            <ShoppingCart size={18} />

            <span>Cart</span>

            {/* Cart Count */}
            <span className="absolute -top-2 -right-2 bg-pink-200 text-[#7a1f4d] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
              0
            </span>
          </Link>

          {/* About Us */}
          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setShowAbout(true)}
            onMouseLeave={() => setShowAbout(false)}
          >
            <button
              type="button"
              className="h-10 px-5 rounded-full bg-white text-[#be185d] font-semibold flex items-center justify-center hover:bg-pink-100 transition whitespace-nowrap"
            >
              About Us
            </button>

            {/* About Dropdown */}
            {showAbout && (
              <div className="absolute top-10 right-0 pt-3">
                <div className="w-80 bg-white rounded-3xl shadow-2xl p-6 text-gray-800 border border-pink-100">
                  <h3 className="text-xl font-serif font-bold text-[#be185d]">
                    About Glamira Essence
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Glamira Essence brings premium beauty and skincare
                    essentials crafted to enhance your natural glow. We believe
                    in elegance, quality ingredients, and confidence through
                    beauty.
                  </p>

                  <div className="mt-4 text-sm font-medium text-[#be185d]">
                    ✨ Premium Beauty Collection
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
