import BaseBadge from "./BaseBadge";

export default function StatusBadge({
  active,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  size = "sm",
}) {
  return (
    <BaseBadge tone={active ? "green" : "gray"} size={size} shape="soft">
      {active ? activeLabel : inactiveLabel}
    </BaseBadge>
  );
}
