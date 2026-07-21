import { useState, useEffect } from "react";
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

export function useTeams({ skip = false } = {}) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skip) return;

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/teams");
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [skip]);

  const createTeam = async (formData) => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        manager: formData.manager,
        agents: formData.agents,
        description: formData.description,
        isActive: formData.isActive,
      };

      const { data: result } = await api.post("/api/teams", payload);
      setTeams((prev) => [...prev, result.team]);

      Toast.fire({ icon: "success", title: "Team created successfully" });
      return result.team;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Something went wrong";
      Swal.fire({ icon: "error", title: "Error", text: message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (teamId, formData) => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        manager: formData.manager,
        agents: formData.agents,
        description: formData.description,
        isActive: formData.isActive,
      };

      const { data: result } = await api.put(`/api/teams/${teamId}`, payload);
      setTeams((prev) => prev.map((t) => (t._id === teamId ? result.team : t)));

      Toast.fire({ icon: "success", title: "Team updated successfully" });
      return result.team;
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Something went wrong";
      Swal.fire({ icon: "error", title: "Error", text: message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return false;

    setLoading(true);
    try {
      await api.delete(`/api/teams/${teamId}`);
      setTeams((prev) => prev.filter((t) => t._id !== teamId));
      Toast.fire({ icon: "success", title: "Team deleted successfully" });
      return true;
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete team.",
        icon: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { teams, loading, createTeam, updateTeam, deleteTeam };
}
