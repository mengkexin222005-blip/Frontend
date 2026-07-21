import { Plus } from "lucide-react";

const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <circle
      cx="8"
      cy="8"
      r="7.5"
      fill="#16a34a"
      stroke="#15803d"
      strokeWidth="0.5"
    />
    <path
      d="M4.5 8.25L6.75 10.5L11.5 5.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function KanbanColumnHeader({
  label,
  count,
  successStatus = null, // e.g. "Qualifed", "Closed Won", "Done" — column to highlight green
  onAdd = null, // if provided, renders the + button
  addLabel = null, // tooltip label for the + button
  subtext = null, // optional line below the title
}) {
  const isSuccess = successStatus && label === successStatus;

  return (
    <div
      className={`p-3 rounded-t-md border-y z-20 ${
        isSuccess
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-gray-50"
      }`}
      style={{ position: "sticky", top: 0 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {isSuccess && <CheckCircleIcon />}
          <h3
            className={`text-md font-semibold ${
              isSuccess ? "text-green-700" : "text-gray-500"
            }`}
          >
            {label}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isSuccess
                ? "text-green-700 bg-green-100"
                : "text-gray-400 bg-gray-200"
            }`}
          >
            {count}
          </span>
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="p-0.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title={addLabel || `Add to ${label}`}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
      {subtext && (
        <p
          className={`text-xs font-medium ${isSuccess ? "text-green-600" : "text-gray-400"}`}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
