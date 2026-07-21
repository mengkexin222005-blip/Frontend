import {useCallback,useMemo,useState} from "react";
import {FaPlus} from "react-icons/fa";
import Select from "react-select";
import {PageHeader,PageToolbar} from "../../../components/page";
import FilterPopover from "../../../components/filters/FilterPopover";
import {useFilterPopover} from "../../../components/filters/useFilterPopover";
import {getSelectProps} from "../../../components/select/selectConfig";
import UserTable from "../UserTable";
import UserForm from "../UserForm";
import UserView from "../UserView";
import EditAccessTab from "./EditAccessTab";
import ReportsTab from "./ReportsTab";
import {useUsers} from "../hooks/useUsers";
import {useUserForm} from "../hooks/useUserForm";

export default function UsersTab(){
  const [activeTab,setActiveTab]=useState("Users");
  const [search,setSearch]=useState("");
  const [viewUser,setViewUser]=useState(null);
  const [filterRole,setFilterRole]=useState(null);
  const [filterStatus,setFilterStatus]=useState(null);
  const {users=[],loading,createUser,updateUser}=useUsers();
  const {
    formData,addressCodes,preview,avatar,setAvatar,handleChange,handleAddressSelect,
    showPassword,setShowPassword,showConfirmPassword,setShowConfirmPassword,
    showSidePane,editingUser,openCreateSidePane,openEditSidePane,resetAndClose,
  }=useUserForm();

  const roleOptions=useMemo(()=>[...new Set(users.map(user=>user.role).filter(Boolean))].sort().map(value=>({label:value,value})),[users]);
  const statusOptions=useMemo(()=>[...new Set(users.map(user=>user.status).filter(Boolean))].sort().map(value=>({label:value,value})),[users]);

  const clearAllFilters=useCallback(()=>{
    setFilterRole(null);
    setFilterStatus(null);
  },[]);

  const {
    filterOpen,setFilterOpen,filterRef,activeFilterCount,
    clearAllFilters:handleClearFilters,
  }=useFilterPopover({filterRole,filterStatus},clearAllFilters);

  const filteredUsers=useMemo(()=>{
    const query=search.trim().toLowerCase();
    return users.filter(user=>{
      const name=[user.firstName,user.middleName,user.lastName,user.suffixName].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch=!query||[
        user.employeeId,name,user.email,user.phone,user.role,user.status,
      ].some(value=>String(value||"").toLowerCase().includes(query));
      const matchesRole=!filterRole||user.role===filterRole;
      const matchesStatus=!filterStatus||user.status===filterStatus;
      return matchesSearch&&matchesRole&&matchesStatus;
    });
  },[users,search,filterRole,filterStatus]);

  const submit=async(event)=>{
    event.preventDefault();
    const result=editingUser
      ?await updateUser(editingUser,formData,avatar)
      :await createUser(formData,avatar);
    if(result) resetAndClose();
  };

  return(
    <div className="flex h-full min-h-0 flex-col px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex shrink-0 gap-4 border-b border-gray-200 overflow-x-auto sm:gap-11">
        {["Users","Edit Access","Reports"].map(tab=>(
          <button
            key={tab}
            type="button"
            onClick={()=>setActiveTab(tab)}
            className={`relative px-1 pb-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab===tab?"text-red-600":"text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
            {activeTab===tab&&<span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-red-600"/>}
          </button>
        ))}
      </div>

      {activeTab==="Users"&&(
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="mb-3 mt-3 flex shrink-0 flex-col gap-3 sm:mb-4 sm:mt-4 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <PageHeader title="Users" subtitle="Manage system users and roles"/>
            <PageToolbar
              searchValue={search}
              onSearchChange={event=>setSearch(event.target.value)}
              searchPlaceholder="Search users..."
              filterSlot={
                <FilterPopover
                  filterRef={filterRef}
                  filterOpen={filterOpen}
                  onToggle={()=>setFilterOpen(previous=>!previous)}
                  activeFilterCount={activeFilterCount}
                  onClearAll={handleClearFilters}
                >
                  <div>
                    <p className="mb-1 text-xs text-gray-400">Role</p>
                    <Select
                      {...getSelectProps({variant:"filter"})}
                      placeholder="All roles"
                      options={roleOptions}
                      value={roleOptions.find(option=>option.value===filterRole)||null}
                      onChange={option=>setFilterRole(option?.value||null)}
                    />
                  </div>
                  {statusOptions.length>0&&(
                    <div>
                      <p className="mb-1 text-xs text-gray-400">Status</p>
                      <Select
                        {...getSelectProps({variant:"filter"})}
                        placeholder="All statuses"
                        options={statusOptions}
                        value={statusOptions.find(option=>option.value===filterStatus)||null}
                        onChange={option=>setFilterStatus(option?.value||null)}
                      />
                    </div>
                  )}
                </FilterPopover>
              }
              actionButton={
                <button
                  type="button"
                  onClick={openCreateSidePane}
                  className="w-full sm:w-auto min-w-[150px] cursor-pointer rounded-md bg-red-500 px-4 sm:px-5 py-2 text-white hover:bg-red-600 text-sm"
                >
                  <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                    <FaPlus size={11}/>
                    Add User
                  </span>
                </button>
              }
            />
          </div>

          <div className="min-h-0 flex-1 overflow-auto no-scrollbar">
            <UserTable
              users={filteredUsers}
              isLoading={loading}
              onEdit={openEditSidePane}
              onView={setViewUser}
            />
          </div>

          <UserForm
            open={showSidePane}
            editingUser={editingUser}
            formData={formData}
            addressCodes={addressCodes}
            preview={preview}
            loading={loading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onChange={handleChange}
            onAddressSelect={handleAddressSelect}
            onAvatarChange={setAvatar}
            onClearAvatar={()=>setAvatar(null)}
            onSubmit={submit}
            onClose={resetAndClose}
            onCancel={resetAndClose}
          />

          {viewUser&&<UserView user={viewUser} onClose={()=>setViewUser(null)}/>}
        </div>
      )}

      {activeTab==="Edit Access"&&(
        <div className="min-h-0 flex-1 overflow-auto no-scrollbar">
          <EditAccessTab/>
        </div>
      )}

      {activeTab==="Reports"&&(
        <div className="min-h-0 flex-1 overflow-auto">
          <ReportsTab/>
        </div>
      )}
    </div>
  );
}