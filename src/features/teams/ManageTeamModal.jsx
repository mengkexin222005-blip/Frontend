import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";

import Modal from "../../components/modal/Modal";
import AssignAgentModal from "../../components/modal/AssignAgentModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import BaseCard from "../../components/card/BaseCard";
import GenderIcon from "../../components/GenderIcon";
import BaseBadge from "../../components/badge/BaseBadge";
import ViewUserCard from "../../components/view/ViewUserCard";

import { useManageTeam } from "./hooks/useManageTeam";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";

/**
 * ManageTeamModal
 *
 * Modal for viewing and managing team member assignments.
 * Displays a list of current agents with options to remove them,
 * and a button to assign new agents to the team.
 *
 * @prop {boolean}    open         - controls visibility
 * @prop {() => void} onClose      - called when modal is dismissed
 * @prop {object}     team         - the team object (with agents array)
 * @prop {string}     teamId       - the team's _id
 * @prop {boolean}    [loading]    - shows skeleton state when true
 * @prop {Function}   refreshTeam  - callback to re-fetch team after mutations
 */

function AgentRow({ agent, onRemove }) {
  const isActive = agent.status === "active";

  return (
    <div className="flex items-center gap-3 py-3 px-3 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors rounded-md group">
      <img
        src={getProfileImage(agent)}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-gray-700 truncate">
            {getDisplayName(agent, {
              includeMiddleInitial: true,
              includeSuffix: true,
            })}
          </p>
          <GenderIcon gender={agent.sex} />
        </div>
        <p className="text-xs text-gray-400 truncate">{agent.email}</p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0 mr-2">
        <span className="text-xs font-mono text-gray-500">
          {agent.employeeId}
        </span>
        <BaseBadge
          tone={isActive ? "green" : "gray"}
          size="xs"
          title={`${isActive ? "Active" : "Inactive"} status`}
        >
          {isActive ? "Active" : "Inactive"}
        </BaseBadge>
      </div>

      <button
        type="button"
        onClick={() => onRemove?.(agent)}
        title="Remove from team"
        className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 px-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-36 bg-gray-100 rounded-md" />
        <div className="h-2.5 w-48 bg-gray-100 rounded-md" />
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0 mr-2">
        <div className="h-3 w-16 bg-gray-100 rounded-md" />
        <div className="h-4 w-12 bg-gray-100 rounded-full" />
      </div>
      <div className="w-6 h-6 bg-gray-100 rounded-md" />
    </div>
  );
}

export default function ManageTeamModal({
  open,
  onClose,
  team,
  teamId,
  loading,
  refreshTeam,
}) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null); // agent object to remove
  const isChildOpen = assignOpen || !!removeTarget;
  const [removing, setRemoving] = useState(false);

  const { assignableAgents, agentsLoading, assignAgent, unassignAgent } =
    useManageTeam(teamId, refreshTeam);

  const agents = team?.agents ?? [];

  const handleAssignConfirm = async (agentId) => {
    if (!agentId) return false;
    return await assignAgent(agentId);
  };

  // Opens the confirm modal for the clicked agent
  const handleRemoveClick = (agent) => {
    setRemoveTarget(agent);
  };

  // Called when the user confirms removal in ConfirmModal
  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    const success = await unassignAgent(removeTarget._id);
    setRemoving(false);
    if (success) setRemoveTarget(null);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Manage Team"
        maxWidth="max-w-xl"
      >
        <div className={isChildOpen ? "pointer-events-none opacity-60" : ""}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Members&nbsp;({agents.length})
            </p>
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 transition-colors px-3 py-1.5 rounded-md cursor-pointer"
            >
              <UserPlus size={13} />
              Assign Agent
            </button>
          </div>

          {/* Agent List */}
          <BaseCard className="py-1 px-2 min-h-[120px]">
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : agents.length > 0 ? (
              agents.map((agent) => (
                <AgentRow
                  key={agent._id}
                  agent={agent}
                  onRemove={handleRemoveClick}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300 gap-2">
                <UserPlus size={28} />
                <p className="text-sm">No agents assigned yet</p>
              </div>
            )}
          </BaseCard>
        </div>
      </Modal>

      {/* Assign Agent sub-modal */}
      <AssignAgentModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        salesAgents={assignableAgents}
        title="Assign Agent to Team"
        subtitle="Only agents without an existing team assignment are shown."
        selectLabel="Select an agent to add"
        confirmLabel={agentsLoading ? "Loading…" : "Assign"}
        confirmingLabel="Assigning…"
        confirmColor="bg-red-600 hover:bg-red-700"
        hideCurrentAssignee={true}
        onConfirm={handleAssignConfirm}
      />

      {/* Remove Agent confirmation modal */}
      <ConfirmModal
        open={!!removeTarget}
        submitting={removing}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveConfirm}
        title="Remove agent from team?"
        description="This agent will be unassigned and will no longer be part of this team."
        warning="⚠ The agent will lose access to team-scoped data until reassigned."
        confirmText="Remove"
        submittingText="Removing…"
        confirmClass="bg-red-600 hover:bg-red-700"
      >
        {removeTarget && <ViewUserCard user={removeTarget} label="Agent" />}
      </ConfirmModal>
    </>
  );
}
