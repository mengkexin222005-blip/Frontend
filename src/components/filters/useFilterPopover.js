import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useFilterPopover
 *
 * Manages the filter popover open/close state, outside-click dismissal,
 * active filter count, and a clear-all helper.
 *
 * @param {Record<string, any>} filters  - object whose values are the current filter values
 * @param {() => void}          onClear  - callback that resets all filter values to null/undefined
 *
 */
export function useFilterPopover(filters = {}, onClear) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearAllFilters = useCallback(() => {
    onClear?.();
  }, [onClear]);

  return {
    filterOpen,
    setFilterOpen,
    filterRef,
    activeFilterCount,
    clearAllFilters,
  };
}
