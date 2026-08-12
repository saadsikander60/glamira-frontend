"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { getApiError } from "@/lib/apiError";

export default function RegisterPage() {
  const router = useRouter();

  const { showToast } = useToast();
  const { loading: authLoading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      router.replace(isAdmin ? "/admin" : "/account");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");

      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      showToast(
        response.data.message || "Account created successfully",
        "success",
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="site-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Glow */}

      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[35px] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-pink-200 uppercase tracking-[0.35em] text-sm">
              Create Account
            </p>

            <h1 className="text-4xl font-serif font-bold text-white mt-4">
              Join Glamira
            </h1>

            <p className="text-pink-100 mt-3 text-sm">
              Create your account and start your beauty journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className="w-full px-5 py-3 rounded-full bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className="w-full px-5 py-3 rounded-full bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
            />

            {/* Password */}

            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-5 py-3 pr-12 rounded-full bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-3.5 text-[#be185d]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}

            <div className="relative">
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-5 py-3 pr-12 rounded-full bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-3.5 text-[#be185d]"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-3 rounded-full bg-white text-[#be185d] font-semibold hover:bg-pink-100 transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-6 text-pink-100 text-sm">
            Already have an account?
            <Link
              href="/login"
              className="ml-2 text-white font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
