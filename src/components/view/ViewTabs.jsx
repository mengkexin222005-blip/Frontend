/**
 * ViewTabs
 *
 * Horizontal tab bar used inside view drawers.
 *
 * @prop {string[]}    tabs        - ordered list of tab labels
 * @prop {string}      activeTab   - currently active tab label
 * @prop {(t) => void} onTabChange - called with the new tab label
 *
 */
export default function ViewTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-0 mt-2 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`px-5 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === tab
              ? "border-red-500 text-red-500"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
