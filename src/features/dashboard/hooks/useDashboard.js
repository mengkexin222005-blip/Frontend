import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";

export function useDashboard() {
  const [stats, setStats] = useState({
    openTasks: [],
    meetings: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get("/api/dashboard/stats");

      setStats({
        openTasks: Array.isArray(data?.openTasks) ? data.openTasks : [],
        meetings: Array.isArray(data?.meetings) ? data.meetings : [],
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      setStats({
        openTasks: [],
        meetings: [],
      });

      setError(err.response?.data?.error || "");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}