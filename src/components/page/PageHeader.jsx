/**
 * PageHeader
 *
 * Renders the left-side title + subtitle block used at the top of every page.
 *
 * @prop {string} title    - main heading
 * @prop {string} subtitle - supporting description line
 *
 */
export default function PageHeader({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
