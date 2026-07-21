import BaseCard from "./BaseCard";
import InfoTooltip from "../../components/InfoToolTip";

const COLORS = {
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    border: "border-red-200",
  },
  sky: {
    bg: "bg-sky-50",
    icon: "text-sky-600",
    border: "border-sky-200",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    border: "border-emerald-200",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    border: "border-amber-200",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-200",
  },
};

export default function StatCard({
  icon,
  label,
  tooltip,
  value,
  color = "red",
  sub,
  loading = false,
}) {
  const c = COLORS[color] ?? COLORS.red;

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-md p-5 flex items-center gap-4 shadow-sm">
        <div className="w-11 h-11 rounded-md bg-gray-100 animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-gray-100 rounded-md animate-pulse" />
          <div className="h-6 w-12 bg-gray-100 rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <BaseCard hover className="flex items-center gap-4">
      <div
        className={`w-13 h-15 rounded-md ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}
      >
        <span className={`${c.icon}`}>{icon}</span>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1 mb-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-none">
            {label}
          </p>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        <p className="text-2xl font-semibold text-gray-800 leading-none">
          {value ?? "—"} %
        </p>
        {sub && <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>}
      </div>
    </BaseCard>
  );
}