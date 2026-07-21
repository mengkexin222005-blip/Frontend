import { FiGrid, FiList } from "react-icons/fi";

/**
 * PageToolbar
 *
 * Renders the right-side toolbar used across all CRM pages:
 *   [search input] [filter slot] [view toggle?] [action button?]
 *
 * @prop {string}          searchValue      - controlled search input value
 * @prop {(e) => void}     onSearchChange   - onChange handler for the search input
 * @prop {string}          searchPlaceholder- placeholder text for the search input
 * @prop {React.ReactNode} filterSlot       - rendered <FilterPopover> (or null)
 * @prop {string}          [view]           - current view: "kanban" | "table"
 * @prop {(v) => void}     [onViewChange]   - called with "kanban" or "table" when toggled
 * @prop {React.ReactNode} [actionButton]   - 
 *
 */
export default function PageToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterSlot,
  view,
  onViewChange,
  actionButton,
}) {
  const showViewToggle = view !== undefined && onViewChange !== undefined;

  return (
    <div className="flex items-center gap-2.5">
      {/* Search */}
      <input
        type="text"
        placeholder={searchPlaceholder}
        className="border border-gray-300 rounded-md px-3 py-1.75 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 w-56"
        value={searchValue}
        onChange={onSearchChange}
      />

      {/* Filter slot */}
      {filterSlot}

      {/* View toggle (kanban / table) */}
      {showViewToggle && (
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => onViewChange("kanban")}
            className={`p-2 transition-colors cursor-pointer ${
              view === "kanban"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
            title="Kanban view"
          >
            <FiGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("table")}
            className={`p-2 transition-colors cursor-pointer ${
              view === "table"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
            title="Table view"
          >
            <FiList size={16} />
          </button>
        </div>
      )}

      {/* Action button */}
      {actionButton}
    </div>
  );
}