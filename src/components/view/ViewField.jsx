/**
 * View Field
 *
 * A label + value display pair used inside view drawers.
 *
 * @prop {string} label - uppercase tracking label
 * @prop {string} value - displayed value; falls back to "—" if falsy
 *
 */
export function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm text-gray-700 font-medium">{value || "—"}</p>
    </div>
  );
}

/**
 * SectionBlock
 *
 * A titled section wrapper used inside view drawers.
 * Renders children in a 3-column grid by default, or a vertical stack when fullWidth is true.
 *
 * @prop {string}          title     - section heading
 * @prop {boolean}         [fullWidth] - stacks children vertically instead of grid
 * @prop {React.ReactNode} children
 *
 */
export function SectionBlock({ title, children, fullWidth }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 pb-1 border-b border-gray-100">
        {title}
      </h3>
      <div
        className={fullWidth ? "space-y-4" : "grid grid-cols-3 gap-x-6 gap-y-4"}
      >
        {children}
      </div>
    </div>
  );
}
