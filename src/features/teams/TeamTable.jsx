import { Pencil } from "lucide-react";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";

import {
  BaseTable,
  TableRow,
  TableCell,
  TablePagination,
  useTablePagination,
} from "../../components/table";
import LoaderTables from "../../components/loader/TablesLazyLoader";

import StatusBadge from "../../components/badge/StatusBadge";

export default function TeamTable({ teams, onEdit, onView, isLoading = false }) {
  const columns = [
    { label: "Team Name" },
    { label: "Manager" },
    { label: "Agents" },
    { label: "Status" },
    { label: "", align: "text-right" },
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
  } = useTablePagination(teams, 10);

  const HEADERS = columns.map((col) => col.label);

  if (isLoading) {
    return (
      <LoaderTables
        paginatedItems="loading"
        headers={HEADERS}
        emptyMessage="No teams found."
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
        renderRow={(team) => (
          <TableRow key={team._id} onClick={() => onView(team)}>
            <TableCell>{team.name}</TableCell>
            <TableCell>
              {team.manager ? (
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(team.manager)}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border border-gray-300 shrink-0"
                  />
                  <span>
                    {getDisplayName(team.manager, {
                      includeMiddleInitial: true,
                      includeSuffix: true,
                    })}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
            </TableCell>
            <TableCell>
              {team.agents?.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {team.agents.slice(0, 4).map((agent) => (
                      <img
                        key={agent._id}
                        src={getProfileImage(agent)}
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover border-2 border-white"
                        title={getDisplayName(agent)}
                      />
                    ))}
                  </div>
                  <span>
                    {team.agents.length} agent
                    {team.agents.length !== 1 ? "s" : ""}
                  </span>
                </div>
              ) : (
                <span className="text-sm italic text-gray-400">No agents</span>
              )}
            </TableCell>
            <TableCell>
              <StatusBadge active={team.isActive} />
            </TableCell>
            <TableCell align="text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(team);
                }}
                className="p-2 rounded-md text-gray-400 hover:text-[#ef4444] transition-colors cursor-pointer"
                title="Edit team"
              >
                <Pencil size={16} />
              </button>
            </TableCell>
          </TableRow>
        )}
      />
    );
  }

  return (
    <>
      <BaseTable
        columns={columns}
        empty={paginatedItems.length === 0 ? "No teams found." : null}
        colSpan={columns.length}
        heightClass="h-112.5"
      >
        {paginatedItems.map((team) => (
          <TableRow key={team._id} onClick={() => onView(team)}>
            {/* Team Name */}
            <TableCell>{team.name}</TableCell>

            {/* Manager */}
            <TableCell>
              {team.manager ? (
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(team.manager)}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border border-gray-300 shrink-0"
                  />
                  <span>
                    {getDisplayName(team.manager, {
                      includeMiddleInitial: true,
                      includeSuffix: true,
                    })}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
            </TableCell>

            {/* Agents count + avatars */}
            <TableCell>
              {team.agents?.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {team.agents.slice(0, 4).map((agent) => (
                      <img
                        key={agent._id}
                        src={getProfileImage(agent)}
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover border-2 border-white"
                        title={getDisplayName(agent)}
                      />
                    ))}
                  </div>
                  <span>
                    {team.agents.length} agent
                    {team.agents.length !== 1 ? "s" : ""}
                  </span>
                </div>
              ) : (
                <span className="text-sm italic text-gray-400">No agents</span>
              )}
            </TableCell>

            {/* Status badge */}
            <TableCell>
              <StatusBadge active={team.isActive} />
            </TableCell>

            {/* Edit icon */}
            <TableCell align="text-right">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(team);
                }}
                className="p-2 rounded-md text-gray-400 hover:text-[#ef4444] transition-colors cursor-pointer"
                title="Edit team"
              >
                <Pencil size={16} />
              </button>
            </TableCell>
          </TableRow>
        ))}
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
