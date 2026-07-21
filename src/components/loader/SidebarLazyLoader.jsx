export default function SidebarLazyLoader({ className = "", items = 8 }) {
  const Bone = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

  return (
    <div
      className={`
        relative flex flex-col
        w-[240px] h-screen
        bg-white border-r border-gray-100
        ${className}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <Bone className="w-9 h-9 rounded-md shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Bone className="w-24 h-3.5" />
          <Bone className="w-32 h-2.5" />
        </div>
      </div>

      {/* Collapse toggle */}
      <div className="absolute -right-3.5 top-[72px] z-10">
        <Bone className="w-7 h-7 rounded-full" />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-3 pt-4">
        {Array.from({ length: items }).map((_, i) => {
          const isActive = i === items - 1;
          return (
            <div
              key={i}
              className={`
                flex items-center gap-3.5 px-3 py-3 rounded-lg
                ${isActive ? "bg-red-50" : ""}
              `}
            >
              <div
                className={`
                  w-5 h-5 rounded shrink-0 animate-pulse
                  ${isActive ? "bg-red-200" : "bg-gray-200"}
                `}
              />
              <div
                className={`
                  h-3.5 rounded animate-pulse
                  ${isActive ? "bg-red-200" : "bg-gray-200"}
                `}
                style={{ width: `${["72px","52px","56px","44px","76px","48px","44px","64px"][i % 8]}` }}
              />
            </div>
          );
        })}
      </nav>
    </div>
  );
}
