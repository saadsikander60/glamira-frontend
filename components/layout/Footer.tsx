import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d] text-white">
      {/* Glow */}

      <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Customer Support */}

          <div>
            <h3 className="font-serif text-xl font-semibold mb-5">
              Customer Support
            </h3>

            <p className="text-pink-100 text-sm leading-relaxed mb-5">
              Need assistance? Login to your account and connect with our
              support team for a seamless shopping experience.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-[#be185d] font-semibold hover:bg-pink-100 transition shadow-lg"
            >
              Login For Support
            </Link>
          </div>

          {/* Facebook */}

          <div>
            <h3 className="font-serif text-xl font-semibold mb-5">
              Contact Us
            </h3>

            <a
              href="https://www.facebook.com/people/Glamira-Essence/61592607865074/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition">
                <FaFacebookF size={28} className="text-blue-300" />
              </div>

              <div>
                <p className="text-pink-100 text-sm">Follow us on Facebook</p>

                <p className="text-white font-medium">Glamira Essence</p>
              </div>
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6 text-center text-pink-100 text-sm">
          © {new Date().getFullYear()} Glamira Essence. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
