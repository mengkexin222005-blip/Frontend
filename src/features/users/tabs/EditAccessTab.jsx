import { useMemo, useState } from "react";
import { ChevronDown, Save } from "lucide-react";
import Select from "react-select";
import { getDisplayName } from "../../../utils/name";
import { getSelectProps } from "../../../components/select/selectConfig";
import { useAuth } from "../../../context/AuthContext";
import useUserAccess from "../hooks/useUserAccess";
import AccessCard from "../components/AccessCard";
import RoleTemplateSelect from "../components/RoleTemplateSelect";

export default function EditAccessTab() {
  const {
    users,
    selectedUserId,
    selectedUser,
    setSelectedUser,
    roleTemplate,
    setRoleTemplate,
    selectedAccess,
    unselectedAccess,
    toggleAccess,
    saveAccess,
    cancelChanges,
    saving,
  } = useUserAccess();

  const { user: currentUser } = useAuth();
  const [userSearch, setUserSearch] = useState("");

  const userOptions = useMemo(
    () =>
      users
        .filter((user) =>
          currentUser?.role === "Super Admin"
            ? true
            : user.role !== "Super Admin",
        )
        .map((user) => ({
          value: user.employeeId,
          label: `${getDisplayName(user, {
            includeMiddleInitial: true,
            includeSuffix: true,
          })} (${user.employeeId})`,
        })),
    [users, currentUser?.role],
  );

  const sortedUserOptions = useMemo(() => {
    const searchText = userSearch.trim().toLowerCase();
    if (!searchText) return userOptions;

    return [...userOptions].sort((a, b) => {
      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();
      const aStarts = aLabel.startsWith(searchText);
      const bStarts = bLabel.startsWith(searchText);

      if (aStarts !== bStarts) return aStarts ? -1 : 1;

      const aIndex = aLabel.indexOf(searchText);
      const bIndex = bLabel.indexOf(searchText);
      if (aIndex !== bIndex) return aIndex - bIndex;

      return aLabel.localeCompare(bLabel);
    });
  }, [userOptions, userSearch]);

  const roleOptions = useMemo(() => {
    const allRoleOptions = [
      { label: "Super Admin", value: "Super Admin" },
      { label: "Admin", value: "Admin" },
      { label: "Sales Manager", value: "Sales Manager" },
      { label: "Sales Agent", value: "Sales Agent" },
      { label: "Support Staff", value: "Support Staff" },
    ];

    if (currentUser?.role === "Super Admin") {
      return allRoleOptions;
    }

    return allRoleOptions.filter((option) => option.value !== "Super Admin");
  }, [currentUser?.role]);

  return (
    <div className="flex h-full min-h-0 flex-col pt-1 overflow-hidden no-scrollbar no-focus-outline">
      {/* HEADER & DROPDOWNS SELECTION AREA */}
      <div className="grid shrink-0 grid-cols-1 gap-2.5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,.8fr)] lg:items-end">
        <div className="pb-0.5 min-w-0">
          <h2 className="text-base font-semibold leading-tight text-slate-800">
            Edit User Access &amp; Default Role Access
          </h2>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
            Manage what this user can see and access in the system.
          </p>
        </div>

        {/* SELECT USER DROPDOWN */}
        <div className="min-w-0">
          <label className="block text-[11px] font-medium text-slate-600">
            Select User
          </label>

          <div className="mt-1 min-w-0">
            <Select
              {...getSelectProps({ isSearchable: true })}
              options={sortedUserOptions}
              value={sortedUserOptions.find((option) => option.value === selectedUserId) || null}
              onChange={(option) => {
                setSelectedUser(option?.value ?? "");
                setUserSearch("");
              }}
              onInputChange={(value, { action }) => {
                if (action === "input-change") {
                  setUserSearch(value);
                }
              }}
              inputValue={userSearch}
              filterOption={({ label }, inputValue) =>
                label.toLowerCase().includes(inputValue.toLowerCase())
              }
              placeholder="Search user by name..."
              noOptionsMessage={() => "No matching users"}
              isClearable
              styles={{
                ...getSelectProps({ isSearchable: true }).styles,
                control: (base, state) => ({
                  ...getSelectProps({ isSearchable: true }).styles.control(base, state),
                  boxShadow: "none !important",
                  outline: "none !important",
                  "&:focus": {
                    outline: "none !important",
                    boxShadow: "none !important",
                  },
                  "&:focus-visible": {
                    outline: "none !important",
                    boxShadow: "none !important",
                  },
                  "&:focus-within": {
                    outline: "none !important",
                    boxShadow: "none !important",
                  },
                }),
                input: (base) => ({
                  ...getSelectProps({ isSearchable: true }).styles.input(base),
                  boxShadow: "none !important",
                  outline: "none !important",
                }),
              }}
            />
          </div>
        </div>

        {/* ROLE TEMPLATE DROPDOWN */}
        <div className="min-w-0">
          <RoleTemplateSelect 
            value={roleTemplate} 
            onChange={setRoleTemplate} 
            options={roleOptions}
            disabled={!selectedUserId} // Naka-disable kapag walang user na napili
          />
        </div>
      </div>

      {/* 2. CONDITIONAL RENDERING NG MGA METADATA AT TILES */}
      {selectedUser ? (
        <>
          <div className="mt-2.5 grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* USER PROFILE INFO PANEL */}
            <section className="self-start rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="border-b border-gray-200 pb-3 text-sm font-semibold text-slate-800">
                User Information
              </h3>

              <dl className="text-xs">
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
                  <dt className="shrink-0 text-slate-500">Full Name</dt>
                  <dd className="truncate text-right font-medium text-slate-700">
                    {getDisplayName(selectedUser, { includeMiddleInitial: true, includeSuffix: true })}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
                  <dt className="shrink-0 text-slate-500">Email Address</dt>
                  <dd className="truncate text-right text-slate-700">
                    {selectedUser?.email || "—"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-gray-200 py-3">
                  <dt className="shrink-0 text-slate-500">Role</dt>
                  <dd className="truncate text-right text-slate-700">
                    {selectedUser?.role || "—"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3">
                  <dt className="shrink-0 text-slate-500">Status</dt>
                  <dd>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      selectedUser?.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {selectedUser?.status || "Inactive"}
                    </span>
                  </dd>
                </div>
              </dl>
            </section>

            {/* DYNAMIC PERMISSIONS ACCESS TILES */}
            <div className="min-h-0 overflow-auto rounded-lg border border-gray-200 bg-white">
              <AccessCard
                title="Selected Access"
                items={selectedAccess}
                selected
                onClick={toggleAccess}
              />

              <div className="border-t border-gray-200">
                <AccessCard
                  title="Unselected Access"
                  items={unselectedAccess}
                  onClick={toggleAccess}
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (MESSAGES CONTROLS) */}
          <div className="mt-2.5 flex shrink-0 justify-end gap-2.5">
            <button
              type="button"
              onClick={cancelChanges}
              disabled={saving}
              className="h-9 min-w-25 rounded-md border border-gray-300 bg-white px-4 text-[11px] font-semibold text-slate-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveAccess}
              disabled={saving}
              className="flex h-9 min-w-[38.75] items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-[11px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      ) : (
        /* BLANK STATE PLACEHOLDER KAPAG WALANG USER NA NAKASELECT */
        <div className="mt-2.5 flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
          <div className="max-w-sm space-y-1">
            <p className="text-xs font-medium text-slate-600">No User Selected</p>
            <p className="text-[11px] text-slate-400">
              Please choose a staff record from the dropdown menu to adjust their roles and permission modules.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}