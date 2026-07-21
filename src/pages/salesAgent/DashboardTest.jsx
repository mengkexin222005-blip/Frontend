import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLeads } from "../../features/leads/hooks/useLeads";
import { getDisplayName } from "../../utils/name";

import { MdOutlineLeaderboard } from "react-icons/md";
import { FiAlertCircle, FiClock } from "react-icons/fi";
import { BsBriefcase } from "react-icons/bs";

import { isTeamlessAgent } from "../../utils/teamAccess";

function StatCard({ icon, label, value, sub, to, color = "red" }) {
  const colorMap = {
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
    green: "bg-green-50 text-green-500",
    yellow: "bg-yellow-50 text-yellow-500",
    purple: "bg-purple-50 text-purple-500",
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

const statusColors = {
  New: "bg-gray-100 text-gray-600",
  Contacted: "bg-blue-100 text-blue-600",
  Qualified: "bg-amber-100 text-amber-600",
  Lost: "bg-red-100 text-red-600",
  Converted: "bg-green-100 text-green-600",
};

export default function SalesAgentDashboard() {
  const { user } = useAuth();
  const { leads = [] } = useLeads();

  const isTeamless = isTeamlessAgent(user);

  const stats = useMemo(() => {
    const active = leads.filter((l) => !l.convertedToClient);
    const pendingRequest = leads.filter(
      (l) =>
        l.conversionRequested &&
        !l.conversionApproved &&
        !l.convertedToClient,
    );
    const readyToConvert = leads.filter(
      (l) => l.conversionApproved && !l.convertedToClient,
    );
    const converted = leads.filter((l) => l.convertedToClient);

    return { active, pendingRequest, readyToConvert, converted };
  }, [leads]);

  return (
    <>
      {/* Greeting */}
      <div className="py-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.firstName ?? "Agent"} 👋
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          {isTeamless
            ? "Your workspace is limited until you are assigned to a team."
            : "Here's a summary of your assigned leads."}
        </p>
      </div>

      {isTeamless && (
        <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-5 py-4">
          <h2 className="text-sm font-semibold text-amber-800">
            Team assignment required
          </h2>

          <p className="mt-1 text-sm text-amber-700">
            Your account is not assigned to a sales team. Please contact an
            admin or sales manager to assign you to a team before accessing
            leads, clients, quotations, and other features.
          </p>
        </div>
      )}

      {!isTeamless && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<MdOutlineLeaderboard size={22} />}
              label="My Leads"
              value={leads.length}
              sub={`${stats.active.length} active`}
              to="/sales-agent/leads"
              color="red"
            />
            <StatCard
              icon={<FiClock size={20} />}
              label="Pending Approval"
              value={stats.pendingRequest.length}
              sub="Awaiting manager"
              to="/sales-agent/leads"
              color="yellow"
            />
            <StatCard
              icon={<FiAlertCircle size={20} />}
              label="Ready to Convert"
              value={stats.readyToConvert.length}
              sub="Approved by manager"
              to="/sales-agent/leads"
              color="green"
            />
            <StatCard
              icon={<BsBriefcase size={20} />}
              label="Converted"
              value={stats.converted.length}
              sub="All time"
              color="blue"
            />
          </div>

          {/* Recent Leads */}
          <div className="mt-6 bg-white border border-gray-200 rounded-md p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-gray-700">
                My Recent Leads
              </h2>

              <NavLink
                to="/sales-agent/leads"
                className="text-xs text-red-500 hover:underline"
              >
                View all →
              </NavLink>
            </div>

            <table className="w-full text-sm text-gray-600">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Conversion</th>
                </tr>
              </thead>

              <tbody>
                {leads.slice(0, 6).map((lead) => (
                  <tr key={lead._id} className="border-b border-gray-50">
                    <td className="py-2">
                      {getDisplayName(lead, {
                        includeMiddle: true,
                        includeSuffix: true,
                      })}
                    </td>

                    <td className="py-2 text-gray-400">
                      {lead.company ?? "—"}
                    </td>

                    <td className="py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[lead.status] ??
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-2 text-xs text-gray-400">
                      {lead.convertedToClient
                        ? "✅ Converted"
                        : lead.conversionApproved
                          ? "🟢 Ready to convert"
                          : lead.conversionRequested
                            ? "🕐 Awaiting approval"
                            : "—"}
                    </td>
                  </tr>
                ))}

                {leads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400">
                      No leads assigned.
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
