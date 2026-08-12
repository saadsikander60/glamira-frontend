"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";
import { getApiError } from "@/lib/apiError";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login, loading: authLoading, isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      router.replace(isAdmin ? "/admin" : "/account");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      if (token) {
        login(token, user);
      }

      showToast(response.data.message || "Login successful", "success");

      const destination = user?.role === "ADMIN" ? "/admin" : "/account";

      setTimeout(() => {
        router.push(destination);
      }, 800);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <main className="site-bg flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </main>
    );
  }

  return (
    <main className="site-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-rose-200 opacity-20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-[35px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm tracking-[0.35em] text-pink-200 uppercase">
              Welcome Back
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold text-white">
              Login To Glamira
            </h1>
            <p className="mt-3 text-sm text-pink-100">
              Access your account and continue your beauty journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-pink-100">Email Address</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="Enter your email"
                className="mt-2 w-full rounded-full bg-white/90 px-5 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-sm text-pink-100">Password</label>
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-full bg-white/90 px-5 py-3 pr-12 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-5 right-5 text-[#be185d]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white py-3 font-semibold text-[#be185d] transition hover:bg-pink-100 disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-pink-100">
            Don&apos;t have an account?
            <Link
              href="/register"
              className="ml-2 font-semibold text-white hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
