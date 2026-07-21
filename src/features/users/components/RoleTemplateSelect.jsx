import { ChevronDown } from "lucide-react";

export default function RoleTemplateSelect({ value, onChange, options = [] }) {
  return(
    <div>
      <label className="block text-[11px] font-medium text-slate-600">
        Role Template
      </label>

      <div className="relative mt-1">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-8 text-[11px] text-slate-700 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}