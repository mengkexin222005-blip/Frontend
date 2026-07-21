import { Info } from "lucide-react";

export default function InfoTooltip({ text }) {
  return (
    <div className="relative group inline-flex">
      <Info size={12} className="text-gray-300 hover:text-gray-600 cursor-default transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                      hidden group-hover:block w-48 px-4 py-3 rounded-xl
                      bg-white border border-gray-100 shadow-lg
                      text-sm text-gray-600 text-center leading-snug
                      pointer-events-none">
        {text}
      </div>
    </div>
  );
}