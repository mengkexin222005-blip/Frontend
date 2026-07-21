import { FiFilter } from "react-icons/fi";

/**
 * FilterPopover
 *
 * Renders the filter trigger button and the dropdown panel
 * Slot-based: pass filter controls as `children`.
 *
 * @prop {React.Ref}       filterRef        - ref attached to the wrapper div for outside-click handling
 * @prop {boolean}         filterOpen       - whether the popover is visible
 * @prop {() => void}      onToggle         - toggles the popover
 * @prop {number}          activeFilterCount- number of active filters (drives badge + highlight)
 * @prop {() => void}      onClearAll       - resets all filters
 * @prop {React.ReactNode} children         - filter controls rendered inside the popover
 *
 */
export default function FilterPopover({
  filterRef,
  filterOpen,
  onToggle,
  activeFilterCount = 0,
  onClearAll,
  children,
}) {
  return (
    <div className="relative" ref={filterRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-1.75 rounded-md border border-gray-300 text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <FiFilter size={14} />
        Filter
      </button>

      {/* Dropdown panel */}
      {filterOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-40 p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-700">Filters</p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {children}
        </div>
      )}
    </div>
  );
}
