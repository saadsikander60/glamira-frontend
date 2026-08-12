"use client";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmClass =
    tone === "danger"
      ? "bg-[#be185d] hover:bg-[#9d174d]"
      : "bg-[#7a1f4d] hover:bg-[#5c1638]";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2b0a1a]/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#f3d4e0] bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#3b1026]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#7a4a5e]">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-[#f3d4e0] px-4 py-2 text-sm font-medium text-[#7a1f4d] transition hover:bg-[#fdf2f7] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
