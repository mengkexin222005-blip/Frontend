export default function PageBase({ children, className = "" }) {
  return (
    <div
      className={`
        border bg-white border-gray-200
        rounded-md p-6 mt-4
        flex flex-col
        h-[calc(100vh-120px)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
