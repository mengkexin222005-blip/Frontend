import { useState } from "react";
import { FiX } from "react-icons/fi";
import { Pencil } from "lucide-react";

import ViewDrawer from "../../components/view/ViewDrawer";
import ViewTabs from "../../components/view/ViewTabs";

import { Field, SectionBlock } from "../../components/view/ViewField";

import StatusBadge from "../../components/badge/StatusBadge";

import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { formatDateTime } from "../../utils/date";

const TABS = ["Overview", "Members"];

export default function TeamView({ open, team, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <ViewDrawer open={open} onClose={onClose}>
      {team && (
        <>
          {/* Header */}
          <div className="shrink-0 px-6 py-3 bg-white border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(team);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-[#ef4444] text-gray-600 transition-colors hover:text-white cursor-pointer"
              >
                <Pencil size={13} /> Edit
              </button>
            </div>

            {/* Team identity block */}
            <div className="flex items-start gap-4 mb-4">
              {/* Icon placeholder */}
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                <span className="text-xl font-bold text-red-500 select-none">
                  {team.name?.charAt(0)?.toUpperCase() ?? "T"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-800 truncate">
                  {team.name}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {team.agents?.length ?? 0} agent
                  {(team.agents?.length ?? 0) !== 1 ? "s" : ""}
                  {team.manager
                    ? ` · ${getDisplayName(team.manager, { includeMiddleInitial: true })}`
                    : ""}
                </p>
                <div className="mt-1.5">
                  {<StatusBadge active={team?.isActive} />}
                </div>
              </div>
            </div>

            <ViewTabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeTab === "Overview" && (
              <>
                <SectionBlock title="Team Information">
                  <Field label="Team Name" value={team.name} />
                  <Field
                    label="Status"
                    value={team.isActive ? "Active" : "Inactive"}
                  />
                  <Field
                    label="Total Agents"
                    value={String(team.agents?.length ?? 0)}
                  />
                  <div className="col-span-3">
                    <Field
                      label="Description"
                      value={team.description || "—"}
                    />
                  </div>
                </SectionBlock>

                <SectionBlock title="Manager">
                  {team.manager ? (
                    <div className="col-span-3 flex items-center gap-3">
                      <img
                        src={getProfileImage(team.manager)}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {getDisplayName(team.manager, {
                            includeMiddleInitial: true,
                            includeSuffix: true,
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {team.manager.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-3">
                      <p className="text-sm text-gray-400">
                        No manager assigned
                      </p>
                    </div>
                  )}
                </SectionBlock>

                <SectionBlock title="Timestamps">
                  <Field
                    label="Created"
                    value={formatDateTime(team.createdAt)}
                  />
                  <Field
                    label="Last Updated"
                    value={formatDateTime(team.updatedAt)}
                  />
                </SectionBlock>
              </>
            )}

            {activeTab === "Members" && (
              <SectionBlock
                title={`Agents (${team.agents?.length ?? 0})`}
                fullWidth
              >
                {team.agents?.length > 0 ? (
                  <div className="space-y-2">
                    {team.agents.map((agent) => (
                      <div
                        key={agent._id}
                        className="flex items-center gap-3 p-3 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={getProfileImage(agent)}
                          alt="avatar"
                          className="w-9 h-9 rounded-full object-cover border border-gray-300 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {getDisplayName(agent, {
                              includeMiddleInitial: true,
                              includeSuffix: true,
                            })}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {agent.email}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">
                          {agent.employeeId}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-300 gap-2">
                    <span className="text-3xl">👥</span>
                    <p className="text-sm">No agents assigned to this team</p>
                  </div>
                )}
              </SectionBlock>
            )}
          </div>
        </>
      )}
    </ViewDrawer>
  );
}
