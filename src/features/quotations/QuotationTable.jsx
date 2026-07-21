import { Pencil, Calendar, User } from "lucide-react";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatDate } from "../../utils/date";
import { formatCurrencyCompact } from "../../utils/currency";
// import { getProbabilityTone } from "./utils/quotationPresentation";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";
import LoaderTables from "../../components/loader/TablesLazyLoader";

import BaseBadge from "../../components/badge/BaseBadge";
import UserDisplayName from "../../components/UserDisplayName";

const STAGE_CONFIG = {
  Prospecting: { tone: "blue" },
  Qualification: { tone: "indigo" },
  Proposal: { tone: "purple" },
  Negotiation: { tone: "amber" },
  Won: { tone: "green" },
  Lost: { tone: "red" },
};

export default function QuotationTable({ 
  quotations, 
  permissions = {},
  onView, 
  onEdit, 
  isLoading = false 
}) {

  const columns = [
    { label: "Quotation" },
    { label: "Value" },
    // { label: "Probability" },
    { label: "Assigned To" },
    { label: "Expected Close" },
    { label: "Stage" },
    ...(permissions.canEdit ? [{ label: "", align: "text-right" }] : []),
  ];

  const {
    currentPage,
    rowsPerPage,
    totalRows,
    totalPages,
    paginatedItems,
    pageWindow,
    from,
    to,
    goTo,
    setRowsPerPage,
  } = useTablePagination(quotations, 10);

  const HEADERS = columns.map((col) => col.label);

  if (isLoading) {
    return (
      <LoaderTables
        paginatedItems="loading"
        headers={HEADERS}
        emptyMessage="No quotations found."
        heightClass="h-112.5"
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        from={from}
        to={to}
        pageWindow={pageWindow}
        onGoTo={goTo}
        onRowsPerPageChange={setRowsPerPage}
        renderRow={(quotation) => {
          const clientName = quotation.client
            ? `${getDisplayName(quotation.client, { includeMiddleInitial: true, includeSuffix: true })}`
            : null;
          const assignedTo = quotation.assignedTo;
          const assignedName = assignedTo ? (
            <UserDisplayName user={assignedTo} showYou={true}>
              {getDisplayName(assignedTo, {
                includeMiddleInitial: true,
                includeSuffix: true,
              })}
            </UserDisplayName>
          ) : (
            "Unassigned"
          );
          const assignedPhoto = getProfileImage(assignedTo);
          const stageConfig =
            STAGE_CONFIG[quotation.stage] || STAGE_CONFIG.Prospecting;

          return (
            <TableRow key={quotation._id} onClick={() => onView(quotation)}>
              <TableCell className="max-w-72">
                <div className="min-w-0">
                  <p className="font-medium truncate">{quotation.title}</p>
                  {clientName && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {quotation.client?.company && (
                        <span className="font-medium text-gray-500">
                          {quotation.client.company} ·{" "}
                        </span>
                      )}
                      {clientName}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-semibold text-gray-700">
                  {formatCurrencyCompact(quotation.value, quotation.currency)}
                </span>
              </TableCell>
              <TableCell>
                {/* <BaseBadge
                  tone={getProbabilityTone(quotation.probability).tone}
                  size="sm"
                  shape="pill"
                >
                  {quotation.probability}%
                </BaseBadge> */}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {assignedTo ? (
                    <img
                      src={assignedPhoto}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-gray-300 shrink-0"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <User size={13} className="text-gray-400" />
                    </span>
                  )}
                  <span
                    className={`text-sm truncate ${
                      !assignedTo
                        ? "text-gray-400 italic"
                        : "text-gray-700 group-hover:text-[#ef4444]"
                    }`}
                  >
                    {assignedName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {quotation.expectedCloseDate ? (
                  <span className="flex items-center gap-1 text-sm text-gray-600 group-hover:text-[#ef4444]">
                    <Calendar size={12} className="shrink-0" />
                    {formatDate(quotation.expectedCloseDate)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell>
                <BaseBadge tone={stageConfig.tone} shape="soft">
                  {quotation.stage}
                </BaseBadge>
              </TableCell>
              {permissions.canEdit && (
                <TableCell align="text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(quotation);
                    }}
                    className="p-2 rounded-md transition-colors text-gray-400 hover:text-[#ef4444] cursor-pointer"
                    title="Edit quotation"
                  >
                    <Pencil size={16} />
                  </button>
                </TableCell>
              )}
            </TableRow>
          );
        }}
      />
    );
  }

  return (
    <>
      <BaseTable
        columns={columns}
        empty={paginatedItems.length === 0 ? "No quotations found." : null}
        colSpan={columns.length}
        heightClass="h-112.5"
      >
        {paginatedItems.map((quotation) => {
          const clientName = quotation.client
            ? `${getDisplayName(quotation.client, { includeMiddleInitial: true, includeSuffix: true })}`
            : null;
          const assignedTo = quotation.assignedTo;
          const assignedName = assignedTo ? (
            <UserDisplayName user={assignedTo} showYou={true}>
              {getDisplayName(assignedTo, {
                includeMiddleInitial: true,
                includeSuffix: true,
              })}
            </UserDisplayName>
          ) : (
            "Unassigned"
          );
          const assignedPhoto = getProfileImage(assignedTo);
          const stageConfig =
            STAGE_CONFIG[quotation.stage] || STAGE_CONFIG.Prospecting;

          return (
            <TableRow key={quotation._id} onClick={() => onView(quotation)}>
              {/* Quotation (Title + Client) */}
              <TableCell className="max-w-72">
                <div className="min-w-0">
                  <p className="font-medium truncate">{quotation.title}</p>
                  {clientName && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {quotation.client?.company && (
                        <span className="font-medium text-gray-500">
                          {quotation.client.company} ·{" "}
                        </span>
                      )}
                      {clientName}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Value */}
              <TableCell>
                <span className="text-sm font-semibold text-gray-700">
                  {formatCurrencyCompact(quotation.value, quotation.currency)}
                </span>
              </TableCell>

              {/* Probability */}
              {/* <TableCell>
                <BaseBadge
                  tone={getProbabilityTone(quotation.probability).tone}
                  size="sm"
                  shape="pill"
                >
                  {quotation.probability}%
                </BaseBadge>
              </TableCell> */}

              {/* Assigned To */}
              <TableCell>
                <div className="flex items-center gap-2">
                  {assignedTo ? (
                    <img
                      src={assignedPhoto}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-gray-300 shrink-0"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <User size={13} className="text-gray-400" />
                    </span>
                  )}
                  <span
                    className={`text-sm truncate ${
                      !assignedTo
                        ? "text-gray-400 italic"
                        : "text-gray-700 group-hover:text-[#ef4444]"
                    }`}
                  >
                    {assignedName}
                  </span>
                </div>
              </TableCell>

              {/* Expected Close */}
              <TableCell>
                {quotation.expectedCloseDate ? (
                  <span className="flex items-center gap-1 text-sm text-gray-600 group-hover:text-[#ef4444]">
                    <Calendar size={12} className="shrink-0" />
                    {formatDate(quotation.expectedCloseDate)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </TableCell>

              {/* Stage */}
              <TableCell>
                <BaseBadge tone={stageConfig.tone} shape="soft">
                  {quotation.stage}
                </BaseBadge>
              </TableCell>

              {/* Edit */}
              <TableCell align="text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(quotation);
                  }}
                  className="p-2 rounded-md transition-colors text-gray-400 hover:text-[#ef4444] cursor-pointer"
                  title="Edit quotation"
                >
                  <Pencil size={16} />
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </BaseTable>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        from={from}
        to={to}
        pageWindow={pageWindow}
        onGoTo={goTo}
        onRowsPerPageChange={setRowsPerPage}
      />
    </>
  );
}
