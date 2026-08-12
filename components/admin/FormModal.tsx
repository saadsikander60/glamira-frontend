"use client";

interface FormModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

export default function FormModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: FormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2b0a1a]/45 px-4 py-6 backdrop-blur-sm">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-[#f3d4e0] bg-white shadow-xl ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-[#f3d4e0] bg-white px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[#3b1026]">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-[#9f6b82]">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-medium text-[#9f6b82] hover:bg-[#fdf2f7] hover:text-[#be185d]"
          >
            Close
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
