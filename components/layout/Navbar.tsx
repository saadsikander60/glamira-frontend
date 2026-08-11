"use client";

import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Flower2,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, token, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#3b1026]/95 via-[#7a1f4d]/95 to-[#be185d]/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}

        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <Flower2 size={26} className="text-pink-100" />
          </div>

          <span className="text-2xl font-serif font-bold text-white tracking-wide">
            Glamira Essence
          </span>
        </Link>

        {/* Navigation */}

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {[
            { name: "Home", link: "/" },
            { name: "Shop", link: "/products" },
            { name: "Categories", link: "/categories" },
            { name: "About Us", link: "/about" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="relative text-white/80 hover:text-white transition group"
            >
              {item.name}

              <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-pink-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Search */}

        <div className="hidden md:flex items-center w-64 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <input
            placeholder="Search beauty products..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/60"
          />

          <button className="w-9 h-9 rounded-full bg-pink-200 text-[#7a1f4d] flex items-center justify-center hover:bg-white transition">
            <Search size={16} />
          </button>
        </div>

        {/* Icons */}

        <div className="flex items-center gap-5">
          <button className="text-white/80 hover:text-white transition">
            <Heart size={23} />
          </button>

          <Link
            href="/cart"
            className="relative text-white/80 hover:text-white transition"
          >
            <ShoppingCart size={24} />

            <span className="absolute -top-3 -right-3 bg-pink-200 text-[#7a1f4d] text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {token ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-white hover:text-pink-200 transition"
              >
                <User size={24} />

                <span className="hidden xl:block text-sm font-medium">
                  {user?.name || "Account"}
                </span>
              </Link>

              <button
                onClick={logout}
                className="text-white/80 hover:text-pink-200 transition"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white/80 hover:text-white transition"
            >
              <User size={24} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
