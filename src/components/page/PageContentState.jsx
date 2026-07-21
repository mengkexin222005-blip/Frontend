/**
 * PageContentState
 *
 * Wraps page content with an optional empty state.
 *
 * @prop {boolean}         [isEmpty]      - show the empty state message
 * @prop {string}          [emptyTitle]   - heading shown when isEmpty is true
 * @prop {string}          [emptyMessage] - sub-text shown when isEmpty is true
 * @prop {React.ReactNode} children       - actual page content
 *
 */
export default function PageContentState({
  isEmpty = false,
  emptyTitle = "Nothing here yet",
  emptyMessage = "Try adjusting your filters or adding a new record.",
  children,
}) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
        <p className="text-base font-medium text-gray-500">{emptyTitle}</p>
        <p className="text-sm mt-1">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
