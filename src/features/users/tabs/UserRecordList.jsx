import { UserCheck, Magnet, FileText, ListTodo } from "lucide-react";
import { formatDate } from "../../../utils/date";
import { getDisplayName } from "../../../utils/name";
import { formatCurrency } from "../../../utils/currency";
import { getProfileImage } from "../../../utils/avatar";

// Status / Stage pill
const PILL_STYLES = {
  // Lead statuses
  New: "bg-gray-100 text-gray-600",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-blue-100 text-blue-700",
  Converted: "bg-emerald-100 text-emerald-700",
  // Shared
  Lost: "bg-red-100 text-red-600",
  // Client statuses
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-500",
  // Quotation stages
  Prospecting: "bg-gray-100 text-gray-600",
  Qualification: "bg-yellow-100 text-yellow-700",
  Proposal: "bg-blue-100 text-blue-700",
  Negotiation: "bg-orange-100 text-orange-700",
  Won: "bg-emerald-100 text-emerald-700",
  // Task statuses
  "To Do": "bg-gray-100 text-gray-500",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const PRIORITY_DOT = {
  High: "bg-red-500",
  Medium: "bg-yellow-400",
  Low: "bg-gray-300",
};

function RecordAvatar({ person }) {
  const src = getProfileImage(person);
  return (
    <img
      src={src}
      alt={getDisplayName(person)}
      className="w-7 h-7 rounded-full object-cover shrink-0"
    />
  );
}

function Pill({ label }) {
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${PILL_STYLES[label] ?? "bg-gray-100 text-gray-500"}`}
    >
      {label}
    </span>
  );
}
function LeadRow({ item, isLast }) {
  const name = getDisplayName(item, { includeMiddleInitial: true });
  return (
    <Row
      isLast={isLast}
      dotClass="bg-sky-400"
      avatar={<RecordAvatar person={item} />}
      title={name}
      sub={item.email || item.phone}
      meta={item.leadSource || "—"}
      date={item.createdAt}
      right={<Pill label={item.status} />}
    />
  );
}

function ClientRow({ item, isLast }) {
  const name = getDisplayName(item, { includeMiddleInitial: true });
  return (
    <Row
      isLast={isLast}
      dotClass="bg-emerald-400"
      avatar={<RecordAvatar person={item} />}
      title={name}
      sub={item.company || item.email || "—"}
      meta={item.industry}
      date={item.createdAt}
      right={<Pill label={item.status} />}
    />
  );
}

function QuotationRow({ item, isLast }) {
  const client = item.client
    ? `${item.client.firstName} ${item.client.lastName}`
    : "—";
  return (
    <Row
      isLast={isLast}
      dotClass="bg-amber-400"
      icon={<FileText size={13} className="text-amber-500" />}
      title={item.title}
      sub={client}
      meta={formatCurrency(item.value)}
      date={item.expectedCloseDate || item.createdAt}
      dateLabel={item.expectedCloseDate ? "Close" : "Created"}
      right={<Pill label={item.stage} />}
    />
  );
}

function TaskRow({ item, isLast }) {
  return (
    <Row
      isLast={isLast}
      dotClass={PRIORITY_DOT[item.priority] ?? "bg-gray-300"}
      icon={<ListTodo size={13} className="text-violet-500" />}
      title={item.subject}
      sub={item.taskType}
      meta={item.priority + " priority"}
      date={item.dueDate || item.createdAt}
      dateLabel={item.dueDate ? "Due" : "Created"}
      right={<Pill label={item.status} />}
    />
  );
}

function Row({
  isLast,
  dotClass,
  icon,
  avatar,
  title,
  sub,
  meta,
  date,
  dateLabel = "Created",
  right,
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        {avatar ?? (
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
      </div>

      <div className={`min-w-0 flex-1 ${!isLast ? "pb-4" : "pb-0"}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
              <span className="text-xs font-semibold text-gray-700 truncate">
                {title}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5 ml-4">
              {sub && <span className="mr-2">{sub}</span>}
              {meta && <span className="text-gray-500 mr-1">·</span>}
              {meta && <span>{meta}</span>}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 ml-4">
              {dateLabel}: {date ? formatDate(date) : "—"}
            </p>
          </div>
          <div className="shrink-0 mt-0.5">{right}</div>
        </div>
      </div>
    </div>
  );
}

const RESOURCE_CONFIG = {
  leads: { icon: Magnet, label: "leads", RowComponent: LeadRow },
  clients: { icon: UserCheck, label: "clients", RowComponent: ClientRow },
  quotations: { icon: FileText, label: "quotations", RowComponent: QuotationRow },
  tasks: { icon: ListTodo, label: "tasks", RowComponent: TaskRow },
};

export default function UserRecordList({ items = [], loading, resource }) {
  const config = RESOURCE_CONFIG[resource];
  const Icon = config.icon;
  const RowComponent = config.RowComponent;

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <span className="text-sm text-gray-400">Loading {config.label}…</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
        <Icon size={20} />
        <span className="text-sm">No {config.label} found</span>
      </div>
    );
  }

  return (
    <div className="py-2">
      {items.map((item, index) => (
        <RowComponent
          key={item._id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
