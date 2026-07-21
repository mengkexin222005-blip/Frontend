export default function ModalTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b mb-3 border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`pb-2 mr-6 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === tab
              ? "border-red-500 text-red-500"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
