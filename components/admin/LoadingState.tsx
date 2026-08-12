export default function LoadingState({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <p className="text-sm text-pink-100">{label}</p>
    </div>
  );
}
