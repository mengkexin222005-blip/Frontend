import LeadCard from "./LeadCard";
import BaseKanban from "../../components/kanban/BaseKanban";
import KanbanColumnHeader from "../../components/kanban/KanbanColumnHeader";
import LoaderCards from "../../components/loader/CardsLazyLoader";

export default function LeadKanban({
  columns,
  statuses,
  permissions,
  onDragEnd,
  onCardClick,
  isLoading = false,
}) {
  if (isLoading) {
    return <LoaderCards columns={statuses} />;
  }
  return (
    <BaseKanban
      columns={columns}
      statuses={statuses}
      permissions={permissions}
      onDragEnd={onDragEnd}
      emptyMessage="No leads"
      renderHeader={(status, leads) => (
        <KanbanColumnHeader
          label={status}
          count={leads.length}
          successStatus="Qualified"
        />
      )}
      renderCard={(lead, index, leads) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          index={index}
          isLast={index === leads.length - 1}
          permissions={permissions}
          onClick={() => onCardClick(lead)}
        />
      )}
      successStatus="Qualified"
    />
  );
}
