/**
 * Modal Field
 *
 * Read-only label + value display used in modal view modes.
 *
 * Not to be confused with ViewField (used in slide-in drawers) —
 * this one carries an optional icon and is styled for modal density.
 *
 * @prop {string}            label    - uppercase tracking label
 * @prop {React.ElementType} [icon]   - optional icon component (FiUser, Calendar, etc.)
 * @prop {string}            [value]  - plain string value; falls back to "—" (ignored when prose=true)
 * @prop {boolean}           [prose]  - renders value as a scrollable pre-wrap block (for notes/descriptions)
 * @prop {React.ReactNode}   [children] - overrides the default value paragraph entirely
 *
 */
export const ModalField = ({
  label,
  icon: Icon,
  value,
  prose = false,
  children,
}) => (
  <div>
    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
      {Icon && <Icon size={12} />}
      {label}
    </p>
    {children ||
      (prose ? (
        <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-100 rounded-md p-3 min-h-30 h-35 max-h-40 overflow-y-auto">
          {value || "—"}
        </p>
      ) : (
        <p className="text-sm text-gray-700 font-medium">{value || "—"}</p>
      ))}
  </div>
);
