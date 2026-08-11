"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";
import { getApiError } from "@/lib/apiError";

export default function LoginPage() {
  const router = useRouter();

  const { showToast } = useToast();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

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

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d] px-6">
      {/* Glow */}

      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[35px] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-pink-200 uppercase tracking-[0.35em] text-sm">
              Welcome Back
            </p>

            <h1 className="text-4xl font-serif font-bold text-white mt-4">
              Login To Glamira
            </h1>

            <p className="text-pink-100 mt-3 text-sm">
              Access your account and continue your beauty journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-pink-100 text-sm">Email Address</label>

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                className="mt-2 w-full px-5 py-3 rounded-full bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-pink-100 text-sm">Password</label>

              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="mt-2 w-full px-5 py-3 pr-12 rounded-full bg-white/90 text-gray-800 outline-none focus:ring-2 focus:ring-pink-300"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-5 text-[#be185d]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-white text-[#be185d] font-semibold hover:bg-pink-100 transition disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          <div className="text-center mt-6 text-pink-100 text-sm">
            Don't have an account?
            <Link
              href="/register"
              className="ml-2 text-white font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
