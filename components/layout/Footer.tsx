import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d] text-white">
      <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-rose-200 opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-5 font-serif text-xl font-semibold">Shop</h3>
            <div className="space-y-3 text-sm text-pink-100">
              <Link href="/products" className="block hover:text-white">
                All Products
              </Link>
              <Link href="/#categories" className="block hover:text-white">
                Categories
              </Link>
              <Link href="/cart" className="block hover:text-white">
                Shopping Cart
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-serif text-xl font-semibold">
              Customer Support
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-pink-100">
              Need help with an order or product advice? Reach our team anytime
              through the contact page, or sign in for a faster experience.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-[#be185d] shadow-lg transition hover:bg-pink-100"
              >
                Contact Us
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-serif text-xl font-semibold">Follow Us</h3>
            <a
              href="https://www.facebook.com/people/Glamira-Essence/61592607865074/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 transition group-hover:scale-110 group-hover:bg-white/20">
                <FaFacebookF size={28} className="text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-pink-100">Follow us on Facebook</p>
                <p className="font-medium text-white">Glamira Essence</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-pink-100">
          © {new Date().getFullYear()} Glamira Essence. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
