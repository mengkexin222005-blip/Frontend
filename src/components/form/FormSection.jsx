// ── Shared fieldset section wrapper ───────────────────────────────────────

/**
 * Groups form fields inside a labelled fieldset.
 *
 * @param {{ title: string, children: React.ReactNode }} props
 */
export default function FormSection({ title, children }) {
  return (
    <fieldset className="border border-gray-200 rounded-md px-4 pt-3 pb-4">
      <legend className="text-sm font-medium text-gray-500 px-1">
        {title}
      </legend>
      <div className="space-y-3 mt-1">{children}</div>
    </fieldset>
  );
}
