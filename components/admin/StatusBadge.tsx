const orderStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-sky-50 text-sky-700 border-sky-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  NEW: "bg-rose-50 text-rose-700 border-rose-200",
  READ: "bg-sky-50 text-sky-700 border-sky-200",
  RESOLVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ADMIN: "bg-[#fdf2f7] text-[#be185d] border-[#f3d4e0]",
  USER: "bg-slate-50 text-slate-600 border-slate-200",
  COD: "bg-violet-50 text-violet-700 border-violet-200",
  ONLINE: "bg-teal-50 text-teal-700 border-teal-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-slate-50 text-slate-600 border-slate-200",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style =
    orderStyles[status] || "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${style}`}
    >
      {status}
    </span>
  );
}
