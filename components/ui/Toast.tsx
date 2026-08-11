"use client";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
}

export default function Toast({ message, type }: ToastProps) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl text-white shadow-xl ${colors[type]}`}
    >
      {message}
    </div>
  );
}
