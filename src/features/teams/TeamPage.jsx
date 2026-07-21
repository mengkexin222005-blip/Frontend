import { useState, useMemo, useRef, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import Select from "react-select";

import { useTeams } from "./hooks/useTeams";
import { useTeamForm } from "./hooks/useTeamForm";
import { useUsers } from "../users/hooks/useUsers";

import {
  PageBase,
  PageHeader,
  PageToolbar,
  PageContentState,
} from "../../components/page";

import FilterPopover from "../../components/filters/FilterPopover";
import { useFilterPopover } from "../../components/filters/useFilterPopover";

import { getSelectProps } from "../../components/select/selectConfig";

import TeamTable from "./TeamTable";
import TeamForm from "./TeamForm";
import TeamView from "./TeamView";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function TeamsPage() {
  const [viewingTeam, setViewingTeam] = useState(null);
  const [viewPaneOpen, setViewPaneOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const openViewPane = (team) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setViewingTeam(team);
    setViewPaneOpen(true);
  };

  const closeViewPane = () => {
    setViewPaneOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setViewingTeam(null);
      closeTimerRef.current = null;
    }, 300);
  };

  const { teams, loading, createTeam, updateTeam } = useTeams();
  const { users: allUsers } = useUsers();

  const {
    formData,
    handleChange,
    setManager,
    setAgents,
    setIsActive,
    showSidePane,
    editingTeam,
    openCreateSidePane,
    openEditSidePane,
    resetAndClose,
    closeSidePane,
  } = useTeamForm();

  const takenManagerIds = useMemo(() => {
    return new Set(
      teams
        .filter((t) => t._id !== editingTeam)
        .map((t) => t.manager?._id || t.manager)
        .filter(Boolean),
    );
  }, [teams, editingTeam]);

  const takenAgentIds = useMemo(() => {
    return new Set(
      teams
        .filter((t) => t._id !== editingTeam)
        .flatMap((t) => t.agents.map((a) => a._id || a))
        .filter(Boolean),
    );
  }, [teams, editingTeam]);

  const availableManagers = useMemo(
    () =>
      allUsers.filter(
        (u) => u.role === "Sales Manager" && !takenManagerIds.has(u._id),
      ),
    [allUsers, takenManagerIds],
  );

  const availableAgents = useMemo(
    () =>
      allUsers.filter(
        (u) => u.role === "Sales Agent" && !takenAgentIds.has(u._id),
      ),
    [allUsers, takenAgentIds],
  );

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);

  const clearAllFilters = useCallback(() => {
    setFilterStatus(null);
  }, []);

  const {
    filterOpen,
    setFilterOpen,
    filterRef,
    activeFilterCount,
    clearAllFilters: handleClear,
  } = useFilterPopover({ filterStatus }, clearAllFilters);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const query = search.toLowerCase();
      const managerName = team.manager
        ? `${team.manager.firstName} ${team.manager.lastName}`.toLowerCase()
        : "";
      const matchesSearch =
        !query ||
        team.name?.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query) ||
        managerName.includes(query);

      const matchesStatus =
        !filterStatus ||
        (filterStatus === "active" ? team.isActive : !team.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [teams, search, filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTeam) {
      const updated = await updateTeam(editingTeam, formData);
      if (updated) {
        resetAndClose();
        if (viewingTeam?._id === editingTeam) setViewingTeam(updated);
      }
    } else {
      const created = await createTeam(formData);
      if (created) resetAndClose();
    }
  };

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="Teams"
          subtitle="Manage sales teams and assignments"
        />

        <PageToolbar
          searchValue={search}
          onSearchChange={(e) => setSearch(e.target.value)}
          searchPlaceholder="Search teams..."
          filterSlot={
            <FilterPopover
              filterRef={filterRef}
              filterOpen={filterOpen}
              onToggle={() => setFilterOpen((p) => !p)}
              activeFilterCount={activeFilterCount}
              onClearAll={handleClear}
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <Select
                  {...getSelectProps({ variant: "filter" })}
                  placeholder="All statuses"
                  options={STATUS_OPTIONS}
                  value={
                    STATUS_OPTIONS.find((o) => o.value === filterStatus) || null
                  }
                  onChange={(opt) => setFilterStatus(opt?.value || null)}
                />
              </div>
            </FilterPopover>
          }
          actionButton={
            <button
              onClick={openCreateSidePane}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md cursor-pointer"
            >
              <span className="flex items-center gap-2 text-sm">
                <FaPlus size={11} /> Add Team
              </span>
            </button>
          }
        />
      </div>

      <PageContentState loading={false}>
        <TeamTable
          teams={filteredTeams}
          onEdit={openEditSidePane}
          onView={openViewPane}
          isLoading={loading}
        />
      </PageContentState>

      <TeamView
        open={viewPaneOpen}
        team={viewingTeam}
        onClose={closeViewPane}
        onEdit={(team) => {
          closeViewPane();
          openEditSidePane(team);
        }}
        isLoading={loading}
      />

      <TeamForm
        open={showSidePane}
        editingTeam={editingTeam}
        formData={formData}
        loading={loading}
        managers={availableManagers}
        agents={availableAgents}
        onChange={handleChange}
        onManagerChange={setManager}
        onAgentsChange={setAgents}
        onStatusChange={setIsActive}
        onSubmit={handleSubmit}
        onClose={closeSidePane}
        onCancel={resetAndClose}
      />
    </PageBase>
  );
}
