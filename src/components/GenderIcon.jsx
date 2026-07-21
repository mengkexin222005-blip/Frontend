import { Mars, Venus, CircleHelp } from "lucide-react";

export default function GenderIcon({ gender, size = 12, className = "" }) {
  const normalized = gender?.toLowerCase();

  if (normalized === "male") {
    return (
      <Mars size={size} className={`text-sky-400 shrink-0 ${className}`} />
    );
  }

  if (normalized === "female") {
    return (
      <Venus size={size} className={`text-pink-400 shrink-0 ${className}`} />
    );
  }

  return (
    <CircleHelp size={size} className={`text-gray-300 shrink-0 ${className}`} />
  );
}
