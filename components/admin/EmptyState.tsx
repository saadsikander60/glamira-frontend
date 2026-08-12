import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/30 bg-white/10 px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-pink-100">
        <Icon size={22} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-md text-sm text-pink-100">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
