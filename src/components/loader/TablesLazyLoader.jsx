export default function LoaderTables({
  paginatedItems,
  headers,
  renderRow,
  emptyMessage = "No results found.",
  heightClass = "w-full overflow-auto",
  currentPage,
  totalPages,
  totalRows,
  rowsPerPage,
  from,
  to,
  pageWindow,
  onGoTo,
  onRowsPerPageChange,
}) {
  if (!paginatedItems) return null;

  const isLoading = paginatedItems === "loading";

  const Bone = ({ className = "", style = {} }) => (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`} 
      style={style}
    />
  );

  const skeletonRows = Array.from({ length: rowsPerPage ?? 10 });
  const columnCount = headers?.length ?? 5;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Table Container ── */}
      <div className={`w-full overflow-auto ${heightClass}`}>
        <table className="w-full text-sm text-left border-collapse">
          {/* Header */}
          <thead className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <tr>
              {isLoading
                ? Array.from({ length: columnCount }).map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <Bone className="h-3 w-20" />
                    </th>
                  ))
                : headers?.map((header, i) => (
                    <th
                      key={i}
                      className="px-2 py-3 text-xs font-medium uppercase text-gray-500 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              skeletonRows.map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: columnCount }).map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      {colIdx === 0 ? (
                        /* First column special avatar layout */
                        <div className="flex items-center gap-2.5">
                          <Bone className="w-8 h-8 rounded-full shrink-0" />
                          <div className="flex flex-col gap-1.5">
                            <Bone className="h-3 w-24" />
                            <Bone className="h-2.5 w-14" />
                          </div>
                        </div>
                      ) : colIdx === 1 ? (
                        /* Second column text block lines layout */
                        <div className="flex flex-col gap-1.5">
                          <Bone className="h-3" style={{ width: `${120 + (i % 4) * 20}px` }} />
                          <Bone className="h-2.5" style={{ width: `${150 + (i % 3) * 25}px` }} />
                        </div>
                      ) : (
                        /* Default standard columns fallback layout */
                        <Bone className="h-3 w-16" />
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, i) => renderRow(item, i))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Bottom Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 px-1">
       
        <div className="flex items-center gap-2 text-sm text-gray-500 w-full sm:w-auto justify-center sm:justify-start">
          <span className="text-gray-600">Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
            className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-red-400 w-14"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-gray-600">entries</span>
        </div>

        {/* Center Aspect: Record Range Info */}
        <div className="text-center text-sm text-gray-600 w-full sm:w-auto">
          Showing <span className="font-normal">{from}–{to}</span> of{" "}
          <span className="font-normal">{totalRows}</span> entries
        </div>

        {/* Right Aspect: Interactive Page Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
          {isLoading ? (
            <>
              <Bone className="h-4 w-20 hidden md:block" />
              <Bone className="w-8 h-8 rounded-md" />
              <div className="w-8 h-8 rounded-md animate-pulse bg-red-300" />
              <Bone className="w-8 h-8 rounded-md" />
            </>
          ) : (
            <>
              {/* Previous Button */}
              <button
                onClick={() => onGoTo?.(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                type="button"
              >
                ‹
              </button>

              {/* Numbered Page Window Grid */}
              {pageWindow?.map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipse-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => onGoTo?.(page)}
                    type="button"
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors
                      ${currentPage === page
                        ? "bg-red-500 text-white shadow-sm"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => onGoTo?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                type="button"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}