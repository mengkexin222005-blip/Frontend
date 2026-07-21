import { useState, useCallback } from "react";
import { formatDateInput } from "../../../utils/date";
import { useActivities } from "../../../hooks/useActivities";

const EMPTY_FORM = {
  subject: "",
  description: "",
  taskType: "Call",
  priority: "Low",
  scope: "Personal",
  dueDate: "",
  reminderAt: "",
  repeat: "None",
  assignedTo: "",
  relatedToType: "",
  relatedTo: "",
};

const mapTaskToForm = (task) => ({
  subject: task.subject || "",
  description: task.description || "",
  taskType: task.taskType || "Call",
  priority: task.priority || "Low",
  scope: task.scope || "Personal",
  dueDate: formatDateInput(task.dueDate),
  reminderAt: formatDateInput(task.reminderAt),
  repeat: task.repeat || "None",
  assignedTo: task.assignedTo?._id || "",
  relatedToType: task.relatedToType || "",
  relatedTo: task.relatedTo?._id || "",
});

export function useTaskModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "view" | "edit"
  const [origin, setOrigin] = useState("view"); // set wether the user enters edit mode from view modal or directly from the table
  const [activeTab, setActiveTab] = useState("Overview");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [viewingTask, setViewingTask] = useState(null);
  const { activities, loading: activitiesLoading } = useActivities(
    open && mode === "view" && viewingTask ? "Task" : null,
    viewingTask?._id,
  );

  const openCreate = useCallback((presetStatus) => {
    setFormData({
      ...EMPTY_FORM,
      status: presetStatus || "To Do",
    });
    setViewingTask(null);
    setMode("create");
    setModalOpen(true);
  }, []);

  const openView = useCallback((task) => {
    setViewingTask(task);
    setFormData(mapTaskToForm(task));
    setMode("view");
    setOrigin("view");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task) => {
    setViewingTask(task);
    setFormData(mapTaskToForm(task));
    setMode("edit");
    setOrigin("direct");
    setModalOpen(true);
  }, []);

  const switchToEdit = useCallback(() => {
    setMode("edit");
    setOrigin("view");
  }, []);

  const switchToView = useCallback(() => {
    if (viewingTask) {
      setFormData(mapTaskToForm(viewingTask));
    }
    setMode("view");
  }, [viewingTask]);

  const closeModal = useCallback(() => {
    setActiveTab("Overview");
    setModalOpen(false);
    setViewingTask(null);
    setMode("create");
    setFormData(EMPTY_FORM);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Clear relatedTo when relatedToType changes
      if (name === "relatedToType") {
        next.relatedTo = "";
      }
      return next;
    });
  }, []);

  return {
    modalOpen,
    mode,
    origin,
    activeTab,
    setActiveTab,
    formData,
    viewingTask,
    activities,
    activitiesLoading,
    openCreate,
    openView,
    openEdit,
    switchToEdit,
    switchToView,
    closeModal,
    handleChange,
    handleSelectChange,
  };
}
