import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";

/**
 * Fetches the full team details + aggregated stats for the Sales Manager's team.
 * The team ID comes from the auth user object (user.team.id).
 */
export function useTeamOverview(teamId) {
  const [team, setTeam] = useState(null);
  const [stats, setStats] = useState({
    leads: 0,
    quotations: 0,
    tasks: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeamOverview = useCallback(async () => {
    if (!teamId) return;

    setLoading(true);
    setError(null);

    try {
      const { data: teamData } = await api.get(`/api/teams/${teamId}`);
      setTeam(teamData);

      const [leadsRes, quotationsRes, tasksRes, clientsRes] =
        await Promise.allSettled([
          api.get("/api/leads"),
          api.get("/api/quotations"),
          api.get("/api/tasks"),
          api.get("/api/clients"),
        ]);

      setStats({
        leads:
          leadsRes.status === "fulfilled"
            ? (leadsRes.value.data?.length ?? 0)
            : 0,
        quotations:
          quotationsRes.status === "fulfilled"
            ? (quotationsRes.value.data?.length ?? 0)
            : 0,
        tasks:
          tasksRes.status === "fulfilled"
            ? (tasksRes.value.data?.length ?? 0)
            : 0,
        clients:
          clientsRes.status === "fulfilled"
            ? (clientsRes.value.data?.length ?? 0)
            : 0,
      });
    } catch (err) {
      console.error("useTeamOverview error:", err);
      setError("Failed to load team data.");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeamOverview();
  }, [fetchTeamOverview]);

  const refreshTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      const { data: teamData } = await api.get(`/api/teams/${teamId}`);
      setTeam(teamData);
    } catch (err) {
      console.error("refreshTeam error:", err);
    }
  }, [teamId]);

  return { team, stats, loading, error, refreshTeam };
}
