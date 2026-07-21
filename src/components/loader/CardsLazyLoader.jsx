const CARD_HEIGHTS = [72, 88, 80, 96, 76];

export default function CardsLazyLoader({
  className = "",
  columns = [],
  cardsPerColumn,
  maxHeight = "calc(100vh - 130px)",
}) {
  const Bone = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

  const columnCount = Array.isArray(columns) ? columns.length : 0;

  const computedCardsPerColumn =
    cardsPerColumn ??
    Math.max(2, Math.min(5, Math.ceil(12 / (columnCount || 1))));

  return (
    <div
      className={`overflow-x-auto overflow-y-auto pb-4 ${className}`}
      style={{ maxHeight }}
    >
      <div className="flex gap-4 items-start">
        {columns.map((column, ci) => (
          <div
            key={column}
            className="shrink-0 w-70 flex flex-col rounded-md border bg-[#f5f5f5] border-gray-200"
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200">
              <div className="flex items-center gap-2 w-full">
                <Bone className="h-3.5 w-24" />
                <Bone className="h-5 w-6 rounded-full ml-auto" />
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 flex flex-col gap-2">
              {Array.from({ length: computedCardsPerColumn }).map((_, ri) => (
                <div
                  key={`${ci}-${ri}`}
                  className="bg-white border border-gray-100 rounded-md p-3 flex flex-col gap-2.5 shadow-sm"
                  style={{
                    minHeight: CARD_HEIGHTS[(ci + ri) % CARD_HEIGHTS.length],
                  }}
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2">
                    <Bone className="h-3 w-[65%]" />
                    <Bone className="h-4 w-9 rounded-full shrink-0" />
                  </div>

                  {/* Value */}
                  <Bone className="h-4 w-24" />

                  {/* Client */}
                  <Bone className="h-3 w-[55%]" />

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5" />
                    <div className="flex items-center gap-1">
                      <Bone className="h-2.5 w-2.5 rounded-sm" />
                      <Bone className="h-2.5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}