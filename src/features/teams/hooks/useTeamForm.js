import { useState } from "react";
import { useFormBase } from "../../../hooks/useFormBase";

const EMPTY_FORM = {
  name: "",
  manager: "",
  agents: [],
  description: "",
  isActive: true,
};

export function useTeamForm() {
  const base = useFormBase(EMPTY_FORM);
  const [showSidePane, setShowSidePane] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null); // stores team._id

  const openCreateSidePane = () => {
    if (!editingTeam) {
      setShowSidePane(true);
      return;
    }
    base.resetForm();
    setEditingTeam(null);
    setShowSidePane(true);
  };

  const openEditSidePane = (team) => {
    if (showSidePane && editingTeam === team._id) {
      setShowSidePane(true);
      return;
    }

    base.setFormData({
      name: team.name || "",
      manager: team.manager?._id || team.manager || "",
      agents: (team.agents || []).map((a) => a._id || a),
      description: team.description || "",
      isActive: typeof team.isActive === "boolean" ? team.isActive : true,
    });

    setEditingTeam(team._id);
    setShowSidePane(true);
  };

  const resetAndClose = () => {
    setShowSidePane(false);
    setEditingTeam(null);
    base.resetForm();
  };

  const closeSidePane = () => {
    setShowSidePane(false);
  };

  // Custom setters for multi-select fields
  const setManager = (value) => {
    base.setFormData((prev) => ({ ...prev, manager: value }));
  };

  const setAgents = (values) => {
    base.setFormData((prev) => ({ ...prev, agents: values }));
  };

  const setIsActive = (value) => {
    base.setFormData((prev) => ({ ...prev, isActive: value }));
  };

  return {
    formData: base.formData,
    handleChange: base.handleChange,
    setFormData: base.setFormData,
    setManager,
    setAgents,
    setIsActive,
    showSidePane,
    editingTeam,
    openCreateSidePane,
    openEditSidePane,
    resetAndClose,
    closeSidePane,
  };
}
