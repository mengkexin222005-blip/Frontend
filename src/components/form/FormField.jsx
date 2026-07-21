// ── Shared form primitives ─────────────────────────────────────────────────

export const inputClass =
  "w-full border border-gray-300 rounded-md px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-300 " +
  "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200";

/**
 * Field label with optional required asterisk.
 *
 * @param {{ children: React.ReactNode, required?: boolean }} props
 */
export const FormLabel = ({ children, required }) => (
  <label className="block text-xs text-gray-600 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

/**
 * Styled text input that normalises null/undefined value to "".
 */
export const FormInput = ({
  name,
  value,
  onChange,
  required,
  className = "",
  ...rest
}) => (
  <input
    name={name}
    value={value ?? ""}
    onChange={onChange}
    required={required}
    className={`${inputClass} ${className}`}
    {...rest}
  />
);

/**
 * Styled textarea that normalises null/undefined value to "".
 * resize-none is baked in — use the rows prop to control height.
 *
 * @prop {number} [rows=4]
 *
 */
export const FormTextarea = ({
  name,
  value,
  onChange,
  required,
  rows = 4,
  ...rest
}) => (
  <textarea
    name={name}
    value={value ?? ""}
    onChange={onChange}
    required={required}
    rows={rows}
    className={`${inputClass} resize-none`}
    {...rest}
  />
);
