import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "from-[#7a1f4d] to-[#be185d]",
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-[#f3d4e0] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#9f6b82]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#3b1026]">
            {value}
          </p>
          {hint ? <p className="mt-2 text-xs text-[#9f6b82]">{hint}</p> : null}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm`}
        >
          <Icon size={20} />
        </div>
      </div>
    </article>
  );
}
