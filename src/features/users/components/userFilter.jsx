import FilterPopover from "../../../components/filters/FilterPopover";

export default function UserFilter({
  filterRef,
  filterOpen,
  onToggle,
  role,
  status,
  setRole,
  setStatus,
  onClear,
}){

const count =
(role ? 1 : 0) +
(status ? 1 : 0);


return(

<FilterPopover
filterRef={filterRef}
filterOpen={filterOpen}
onToggle={onToggle}
activeFilterCount={count}
onClearAll={onClear}
>


<div>

<label className="text-xs text-gray-500">
Role
</label>

<select
value={role}
onChange={(e)=>setRole(e.target.value)}
className="
mt-1
w-full
h-10
rounded-md
border
border-gray-300
px-3
text-sm
"
>

<option value="">
All Roles
</option>

<option>
Super Admin
</option>

<option>
Admin
</option>

<option>
Sales Manager
</option>

<option>
Sales Agent
</option>

<option>
Support Staff
</option>

</select>

</div>



<div>

<label className="text-xs text-gray-500">
Status
</label>


<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
className="
mt-1
w-full
h-10
rounded-md
border
border-gray-300
px-3
text-sm
"
>

<option value="">
All Status
</option>

<option value="Active">
Active
</option>

<option value="Inactive">
Inactive
</option>


</select>


</div>


</FilterPopover>

);

}