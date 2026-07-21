import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

/**
 * useManageTeam
 *
 * Handles assign and unassign agent operations for a team.
 * Also fetches assignable (teamless) Sales Agents for the assign dropdown.
 *
 * @param {string|null} teamId      - the team's _id
 * @param {Function}    refreshTeam - callback to re-fetch team data after mutation
 */
export function useManageTeam(teamId, refreshTeam) {
  const [assignableAgents, setAssignableAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);

  const fetchAssignableAgents = useCallback(async () => {
    if (!teamId) return;
    setAgentsLoading(true);
    try {
      const { data } = await api.get(`/api/teams/${teamId}/assignable-agents`);
      setAssignableAgents(data);
    } catch (err) {
      console.error("fetchAssignableAgents error:", err);
    } finally {
      setAgentsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchAssignableAgents();
  }, [fetchAssignableAgents]);

  const assignAgent = useCallback(
    async (agentId) => {
      if (!agentId || !teamId) return false;
      try {
        await api.post(`/api/teams/${teamId}/agents/assign`, { agentId });
        Toast.fire({ icon: "success", title: "Agent assigned successfully" });
        await refreshTeam();
        await fetchAssignableAgents();
        return true;
      } catch (err) {
        console.error("assignAgent error:", err);
        const message = err.response?.data?.error || "Failed to assign agent";
        Swal.fire({ icon: "error", title: "Error", text: message });
        return false;
      }
    },
    [teamId, refreshTeam, fetchAssignableAgents],
  );

  const unassignAgent = useCallback(
    async (agentId) => {
      if (!agentId || !teamId) return false;
      try {
        await api.post(`/api/teams/${teamId}/agents/unassign`, { agentId });
        Toast.fire({ icon: "success", title: "Agent removed from team" });
        await refreshTeam();
        await fetchAssignableAgents();
        return true;
      } catch (err) {
        console.error("unassignAgent error:", err);
        const message = err.response?.data?.error || "Failed to remove agent";
        Swal.fire({ icon: "error", title: "Error", text: message });
        return false;
      }
    },
    [teamId, refreshTeam, fetchAssignableAgents],
  );

  return {
    assignableAgents,
    agentsLoading,
    assignAgent,
    unassignAgent,
  };
}
