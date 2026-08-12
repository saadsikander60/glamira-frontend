"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Flower2,
  LogOut,
  Menu,
  X,
  Package,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const router = useRouter();
  const { user, token, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [showAbout, setShowAbout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#3b1026]/95 via-[#7a1f4d]/95 to-[#be185d]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-lg transition group-hover:scale-110">
            <Flower2 size={26} className="text-pink-100" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-wide text-white">
            Glamira Essence
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          <Link href="/products" className="text-sm font-medium text-pink-100 hover:text-white">
            Shop
          </Link>
          <Link href="/#categories" className="text-sm font-medium text-pink-100 hover:text-white">
            Categories
          </Link>
          <Link href="/contact" className="text-sm font-medium text-pink-100 hover:text-white">
            Contact
          </Link>
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md md:flex md:w-56 lg:w-64"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beauty products..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
          />
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-200 text-[#7a1f4d] transition hover:bg-white"
          >
            <Search size={16} />
          </button>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {token ? (
            <div className="hidden items-center gap-2 sm:flex">
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="flex h-10 items-center justify-center rounded-full border border-white/30 bg-white/15 px-4 font-semibold text-white transition hover:bg-white/25"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="hidden h-10 items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 font-semibold text-white transition hover:bg-white/20 xl:flex"
                >
                  My Account
                </Link>
              )}

              <Link
                href={isAdmin ? "/admin" : "/account"}
                className="flex h-10 items-center gap-2 rounded-full bg-white px-4 font-semibold text-[#be185d] transition hover:bg-pink-100"
              >
                <User size={18} />
                <span className="hidden xl:block">{user?.name || "Account"}</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#be185d] transition hover:bg-pink-100"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/register"
                className="flex h-10 items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 font-semibold text-white transition hover:bg-white/20"
              >
                Join
              </Link>
              <Link
                href="/login"
                className="flex h-10 items-center justify-center rounded-full bg-white px-5 font-semibold text-[#be185d] transition hover:bg-pink-100"
              >
                Login
              </Link>
            </div>
          )}

          <Link
            href="/cart"
            className="relative flex h-10 items-center gap-2 rounded-full bg-white px-4 font-semibold text-[#be185d] transition hover:bg-pink-100"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-200 text-xs font-bold text-[#7a1f4d] shadow">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          </Link>

          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setShowAbout(true)}
            onMouseLeave={() => setShowAbout(false)}
          >
            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-full bg-white px-5 font-semibold whitespace-nowrap text-[#be185d] transition hover:bg-pink-100"
            >
              About Us
            </button>

            {showAbout && (
              <div className="absolute top-10 right-0 pt-3">
                <div className="w-80 rounded-3xl border border-pink-100 bg-white p-6 text-gray-800 shadow-2xl">
                  <h3 className="font-serif text-xl font-bold text-[#be185d]">
                    About Glamira Essence
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Glamira Essence brings premium beauty and skincare essentials
                    crafted to enhance your natural glow. Browse freely as a
                    guest, then create an account when you are ready to shop.
                  </p>
                  <div className="mt-4 text-sm font-medium text-[#be185d]">
                    Premium Beauty Collection
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#be185d] sm:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#3b1026]/95 px-6 py-4 sm:hidden">
          <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 rounded-full bg-white/90 px-4 py-2 text-sm text-gray-800 outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#be185d]"
            >
              Go
            </button>
          </form>

          <div className="flex flex-col gap-3 text-sm text-pink-100">
            <Link href="/products" onClick={() => setMobileOpen(false)}>
              Shop
            </Link>
            <Link href="/#categories" onClick={() => setMobileOpen(false)}>
              Categories
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
            {token ? (
              <>
                <Link
                  href={isAdmin ? "/admin" : "/account"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <User size={16} /> {isAdmin ? "Admin Dashboard" : "My Account"}
                </Link>
                {!isAdmin ? (
                  <>
                    <Link
                      href="/account/orders"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <Package size={16} /> Orders
                    </Link>
                    <Link
                      href="/account/addresses"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <MapPin size={16} /> Addresses
                    </Link>
                  </>
                ) : null}
                <button type="button" onClick={handleLogout} className="text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Create Account
                </Link>
              </>
            )}
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
              <MessageSquare size={16} /> Support
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
