import {Pencil} from "lucide-react";
import {getProfileImage} from "../../utils/avatar";
import {getDisplayName} from "../../utils/name";
import {formatPhone} from "../../utils/format";
import {
  BaseTable,TableRow,TableCell,TablePagination,useTablePagination,
} from "../../components/table";

export default function UserTable({users=[],onEdit,onView,isLoading=false}){
  const columns=[
    {label:"User ID"},
    {label:"Name"},
    {label:"Email"},
    {label:"Phone"},
    {label:"Role"},
    {label:"",align:"text-right"},
  ];

  const {
    currentPage,rowsPerPage,totalRows,totalPages,paginatedItems,
    pageWindow,from,to,goTo,setRowsPerPage,
  }=useTablePagination(users,10);

  if(isLoading) return null;

  return(
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-auto [&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-white">
        <BaseTable
          columns={columns}
          empty={paginatedItems.length===0?"No users found.":null}
          colSpan={columns.length}
          heightClass="h-auto"
        >
          {paginatedItems.map(user=>{
            return(
              <TableRow key={user._id||user.employeeId} onClick={()=>onView?.(user)}>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getProfileImage(user)}
                      alt={getDisplayName(user)}
                      className="h-7 w-7 shrink-0 rounded-full border border-gray-300 object-cover"
                    />
                    <span className="whitespace-nowrap">
                      {getDisplayName(user,{includeMiddleInitial:true,includeSuffix:true})}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatPhone(user.phone)}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="text-right">
                  <button
                    type="button"
                    onClick={event=>{
                      event.stopPropagation();
                      onEdit?.(user);
                    }}
                    className="cursor-pointer rounded-md p-2 text-gray-400 transition hover:text-red-500"
                    title="Edit user"
                  >
                    <Pencil size={17}/>
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </BaseTable>
      </div>

      {totalRows>0&&(
        <div className="shrink-0 border-t border-gray-200 bg-white pt-3">
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
        </div>
      )}
    </div>
  );
}