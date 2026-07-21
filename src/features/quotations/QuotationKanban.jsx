import BaseKanban from "../../components/kanban/BaseKanban";
import KanbanColumnHeader from "../../components/kanban/KanbanColumnHeader";
import QuotationCard from "./QuotationCard";
import LoaderCards from "../../components/loader/CardsLazyLoader";

const formatTotal = (quotations) => {
  const totals = quotations.reduce((acc, d) => {
    const currency = d.currency || "PHP";
    acc[currency] = (acc[currency] || 0) + (d.value || 0);
    return acc;
  }, {});
  const SYMBOLS = { PHP: "₱", USD: "$", EUR: "€" };
  return Object.entries(totals)
    .map(
      ([currency, amount]) =>
        `${SYMBOLS[currency] || currency}${amount.toLocaleString()}`,
    )
    .join(" · ");
};

export default function QuotationKanban({
  columns,
  stages,
  permissions,
  onDragEnd,
  onAddQuotation,
  onCardClick,
  isLoading = false,
}) {
  if (isLoading) {
    return <LoaderCards columns={stages} />;
  }

  return (
    <BaseKanban
      columns={columns}
      statuses={stages}
      onDragEnd={onDragEnd}
      emptyMessage="No quotations"
      renderHeader={(stage, quotations) => (
        <KanbanColumnHeader
          label={stage}
          count={quotations.length}
          successStatus="Won"
          subtext={formatTotal(quotations)}
          onAdd={permissions?.canCreate ? () => onAddQuotation(stage) : null}
          addLabel={`Add quotation to ${stage}`}
        />
      )}
      renderCard={(quotation, index, quotations) => (
        <QuotationCard
          key={quotation._id}
          quotation={quotation}
          index={index}
          isLast={index === quotations.length - 1}
          onClick={() => onCardClick(quotation)}
        />
      )}
      successStatus="Won"
    />
  );
}
