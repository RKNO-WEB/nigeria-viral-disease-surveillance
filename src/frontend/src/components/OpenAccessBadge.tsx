import { LockOpen } from "lucide-react";

export function OpenAccessBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold leading-none shrink-0">
      <LockOpen className="w-3 h-3" />
      Open Access
    </span>
  );
}
