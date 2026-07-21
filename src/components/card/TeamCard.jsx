import BaseCard from "./BaseCard";

export default function TeamCard({
  team,
  detail,
  size = "compact",
  emptyMessage = "No team assigned",
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-md p-5 shadow-sm animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 bg-gray-100 rounded-md" />
            <div className="h-3 w-24 bg-gray-100 rounded-md" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
    );
  }

  const hasTeam = team && typeof team === "object" && team.name;

  if (!hasTeam) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-md border border-gray-100 bg-gray-50">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-gray-400">—</span>
        </div>
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  const initial = team.name.charAt(0).toUpperCase();

  const isCompact = size === "compact";

  return (
    <BaseCard
      className={`
        flex items-center gap-3
      `}
    >
      <div
        className={`
          rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0
          ${isCompact ? "w-9 h-9" : "w-12 h-12"}
        `}
      >
        <span
          className={`
            font-bold text-red-500 select-none
            ${isCompact ? "text-sm" : "text-lg"}
          `}
        >
          {initial}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`
            font-medium text-gray-700 truncate
            ${isCompact ? "text-sm" : "text-base"}
          `}
        >
          {team.name}
        </p>

        {detail && <p className="text-xs text-gray-400 mt-0.5">{detail}</p>}
      </div>

      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-[5px] text-xs font-semibold border ${
          team.isActive
            ? "bg-green-50 text-green-600 border-green-400"
            : "bg-gray-100 text-gray-500 border-gray-300"
        }`}
      >
        {team.isActive ? "Active" : "Inactive"}
      </span>
    </BaseCard>
  );
}
