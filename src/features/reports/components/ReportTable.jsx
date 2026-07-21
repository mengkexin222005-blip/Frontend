import { Link } from "react-router-dom";

import {
  TableRow,
  TableCell,
  useTablePagination,
} from "../../../components/table";
import LoaderTables from "../../../components/loader/TablesLazyLoader";

// Table headers
const HEADERS = [
  { label: "Report Name" },
  { label: "Description" },
  { label: "Category" },
  { label: "Actions" },
];

export default function ReportTable({
  reports = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
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
  } = useTablePagination(reports, 10);

  return (
    <LoaderTables
      paginatedItems={isLoading ? "loading" : paginatedItems}
      headers={HEADERS.map((h) => h.label)}
      emptyMessage="No reports found."
      heightClass="h-[540px]"
      currentPage={currentPage}
      totalPages={totalPages}
      totalRows={totalRows}
      rowsPerPage={rowsPerPage}
      from={from}
      to={to}
      pageWindow={pageWindow}
      onGoTo={goTo}
      onRowsPerPageChange={setRowsPerPage}
      renderRow={(report) => (
        <TableRow key={report.id}>
          {/* Report Name */}
          <TableCell>
            <Link
              to={report.route}
              className="font-medium text-red-600 hover:underline"
            >
              {report.title}
            </Link>
          </TableCell>

          {/* Description */}
          <TableCell>
            <span className="text-gray-600">
              {report.description}
            </span>
          </TableCell>

          {/* Category */}
          <TableCell>
            <span className="text-gray-600">
              {report.category}
            </span>
          </TableCell>

          {/* Actions */}
          <TableCell>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit?.(report)}
                className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(report.id)}
                className="rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </TableCell>
        </TableRow>
      )}
    />
  );
}