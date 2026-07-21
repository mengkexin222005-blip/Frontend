import { useState } from "react";
import {
  Users,
  Magnet,
  UserCheck,
  ListTodo,
  Settings2,
  FileText,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTeamOverview } from "./hooks/useTeamOverview";

import { PageBase, PageHeader } from "../../components/page";

import BaseCard from "../../components/card/BaseCard";
import StatCard from "../../components/card/StatCard";
import TeamCard from "../../components/card/TeamCard";
import ManageTeamModal from "./ManageTeamModal";
import GenderIcon from "../../components/GenderIcon";

import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";

function NoTeamState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Users size={28} className="text-gray-300" />
      </div>
      <h2 className="text-base font-semibold text-gray-600 mb-1">
        You are not assigned to a team yet
      </h2>
      <p className="text-sm text-gray-400 max-w-xs">
        Please contact your admin to be assigned to a team.
      </p>
    </div>
  );
}

function MemberRow({ agent }) {
  const isActive = agent.status === "active";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors rounded-md px-3 -mx-3">
      <img
        src={getProfileImage(agent)}
        alt="avatar"
        className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
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
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-gray-400 shrink-0">
          {agent.employeeId}
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-green-400" : "bg-gray-300"
          }`}
          title={isActive ? "Active" : "Inactive"}
        />
      </div>
    </div>
  );
}

export default function TeamOverviewPage() {
  const { user: currentUser } = useAuth();
  const [manageOpen, setManageOpen] = useState(false);

  const currentUserTeam =
    currentUser?.role === "Sales Manager"
      ? currentUser?.managedTeam
      : currentUser?.team;

  const teamId = currentUserTeam?._id ?? null;

  const { team, stats, loading, error, refreshTeam } = useTeamOverview(teamId);

  const managerName = currentUser
    ? getDisplayName(currentUser, { includeMiddleInitial: true })
    : "You";

  const hasTeam = !!teamId;

  return (
    <PageBase>
      <div className="flex items-center justify-between mb-4">
        <PageHeader
          title="My Team"
          subtitle="Overview of your team and performance"
        />
        {hasTeam && (
          <button
            type="button"
            onClick={() => setManageOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors px-3.5 py-2 rounded-md shadow-sm cursor-pointer shrink-0"
          >
            <Settings2 size={15} />
            Manage Team
          </button>
        )}
      </div>

      {!hasTeam && <NoTeamState />}

      {hasTeam && (
        <div className="space-y-6">
          <TeamCard
            team={team}
            detail={`Manager: ${managerName}`}
            size="large"
            loading={loading}
          />

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Team Performance
            </p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                icon={<Magnet size={18} />}
                label="Leads"
                value={stats.leads}
                color="sky"
                loading={loading}
              />
              <StatCard
                icon={<UserCheck size={18} />}
                label="Clients"
                value={stats.clients}
                color="emerald"
                loading={loading}
              />
              <StatCard
                icon={<FileText size={18} />}
                label="Quotations"
                value={stats.quotations}
                color="red"
                loading={loading}
              />
              <StatCard
                icon={<ListTodo size={18} />}
                label="Tasks"
                value={stats.tasks}
                color="amber"
                loading={loading}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Team Members {`(${team?.agents?.length || 0})`}
            </p>

            <BaseCard className="py-2 px-5">
              {loading ? (
                <div className="space-y-3 py-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 animate-pulse"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-32 bg-gray-100 rounded-md" />
                        <div className="h-2.5 w-44 bg-gray-100 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : team?.agents?.length > 0 ? (
                team.agents.map((agent) => (
                  <MemberRow key={agent._id} agent={agent} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-300 gap-2">
                  <Users size={28} />
                  <p className="text-sm">No agents assigned yet</p>
                </div>
              )}
            </BaseCard>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
      )}

      <ManageTeamModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        team={team}
        teamId={teamId}
        loading={loading}
        refreshTeam={refreshTeam}
      />
    </PageBase>
  );
}
