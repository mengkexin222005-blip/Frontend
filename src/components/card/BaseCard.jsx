export default function BaseCard({
  children,
  className = "",
  padding = "p-5",
  hover = false,
}) {
  return (
    <div
      className={`
        bg-white border border-gray-100 rounded-md shadow-sm
        ${padding}
        ${hover ? "hover:shadow-md transition-shadow" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
