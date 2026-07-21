import { useMemo } from "react";
import { useLeads } from "../../features/leads/hooks/useLeads";
import { useClients } from "../../features/clients/hooks/useClients";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { getDisplayName } from "../../utils/name";

import { MdOutlineLeaderboard } from "react-icons/md";
import { TiGroupOutline } from "react-icons/ti";
import { FaTasks } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

import { isTeamlessManager } from "../../utils/teamAccess";

function StatCard({ icon, label, value, sub, to, color = "red" }) {
  const colorMap = {
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    yellow: "bg-yellow-50 text-yellow-500",
  };

  const card = (
    <div className="bg-white shadow-sm rounded-md p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-full ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );

  return to ? <NavLink to={to}>{card}</NavLink> : card;
}

export default function SalesManagerDashboard() {
  const { user } = useAuth();
  const { leads = [] } = useLeads();
  const { clients = [] } = useClients();
  const { tasks = [] } = useTasks();

  const isTeamless = isTeamlessManager(user);

  const stats = useMemo(() => {
    const newLeads = leads.filter((l) => l.status === "New").length;
    const pendingConversion = leads.filter(
      (l) => l.status === "Pending Conversion",
    ).length;

    const activeClients = clients.filter(
      (c) => c.status === "Active",
    ).length;

    const openTasks = tasks.filter(
      (t) => t.status === "Open" || t.status === "In Progress",
    ).length;
    const overdueTasks = tasks.filter((t) => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date() && t.status !== "Completed";
    }).length;

    return {
      newLeads,
      pendingConversion,
      activeClients,
      openTasks,
      overdueTasks,
    };
  }, [leads, clients, tasks]);

  return (
    <>
      {/* Greeting */}
      <div className="py-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.firstName ?? "Manager"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isTeamless
            ? "Your workspace is limited until you are assigned to manage a team."
            : "Here's a quick overview of your team's activity."}
        </p>
      </div>

      {isTeamless && (
        <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-5 py-4">
          <h2 className="text-sm font-semibold text-amber-800">
            Team assignment required
          </h2>
          <p className="mt-1 text-sm text-amber-700">
            You are not assigned as a manager of any sales team. Please contact
            an admin to assign you to a team before accessing leads, clients,
            quotations, and other features.
          </p>
        </div>
      )}

      {!isTeamless && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={<MdOutlineLeaderboard size={22} />}
              label="Total Leads"
              value={leads.length}
              sub={`${stats.newLeads} new · ${stats.pendingConversion} pending conversion`}
              to="/sales-manager/leads"
              color="red"
            />
            <StatCard
              icon={<TiGroupOutline size={22} />}
              label="Total Clients"
              value={clients.length}
              sub={`${stats.activeClients} active`}
              to="/sales-manager/clients"
              color="blue"
            />
            <StatCard
              icon={<FaTasks size={20} />}
              label="Open Tasks"
              value={stats.openTasks}
              sub={`${tasks.length} total`}
              to="/sales-manager/tasks"
              color="green"
            />
            {stats.overdueTasks > 0 && (
              <StatCard
                icon={<FiAlertCircle size={22} />}
                label="Overdue Tasks"
                value={stats.overdueTasks}
                sub="Needs attention"
                to="/sales-manager/tasks"
                color="yellow"
              />
            )}
          </div>

          {/* Recent Leads Table */}
          <div className="mt-6 bg-white border border-gray-200 rounded-md p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Recent Leads
              </h2>
              <NavLink
                to="/sales-manager/leads"
                className="text-xs text-red-500 hover:underline"
              >
                View all →
              </NavLink>
            </div>
            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Source</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="border-b border-gray-50">
                    <td className="py-2">
                      {getDisplayName(lead, {
                        includeMiddle: true,
                        includeSuffix: true,
                      })}
                    </td>
                    <td className="py-2 text-gray-400">
                      {lead.leadSource ?? "—"}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          lead.status === "New"
                            ? "bg-blue-100 text-blue-600"
                            : lead.status === "Converted"
                              ? "bg-green-100 text-green-600"
                              : lead.status === "Pending Conversion"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">
                      No leads.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
