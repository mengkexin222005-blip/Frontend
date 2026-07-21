import { useState, useCallback } from "react";
import { useActivities } from "../../../hooks/useActivities";
import { useEffect } from "react";
import api from "../../../services/api";

// const STAGE_PROBABILITY = {
//   Prospecting: 10,
//   Qualification: 25,
//   Proposal: 50,
//   Negotiation: 75,
//   Won: 100,
//   Lost: 0,
// };

const EMPTY_FORM = {
  title: "",
  client: "",
  value: "",
  currency: "PHP",
  stage: "Draft",
  // probability: 10,
  expectedCloseDate: "",
  assignedTo: "",
  notes: "",
};

const mapQuotationToForm = (quotation) => ({
  title: quotation.title || "",
  client: quotation.client?._id || "",
  value: quotation.value ?? "",
  currency: quotation.currency || "PHP",
  // probability: quotation.probability ?? 0,
  expectedCloseDate: quotation.expectedCloseDate
    ? quotation.expectedCloseDate.slice(0, 10)
    : "",
  assignedTo: quotation.assignedTo?._id || "",
  notes: quotation.notes || "",
});

export function useQuotationModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [origin, setOrigin] = useState("view");
  const [activeTab, setActiveTab] = useState("Overview");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [viewingQuotation, setViewingQuotation] = useState(null);

  // ── Tasks ──────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    // Only fetch when the modal is open, in view mode, and a quotation is selected
    if (!modalOpen || mode !== "view" || !viewingQuotation?._id) {
      setTasks([]);
      return;
    }

    let cancelled = false;

    const fetchTasks = async () => {
      setTasksLoading(true);
      try {
        const { data } = await api.get(`/api/quotations/${viewingQuotation._id}/tasks`);
        if (!cancelled) setTasks(data);
      } catch (error) {
        console.error("Error fetching quotation tasks:", error);
      } finally {
        if (!cancelled) setTasksLoading(false);
      }
    };

    fetchTasks();

    // Cleanup — avoids setting state on an unmounted/stale effect
    return () => { cancelled = true; };
  }, [modalOpen, mode, viewingQuotation?._id]);
  // ──────────────────────────────────────────────────────

  const { activities, loading: activitiesLoading } = useActivities(
    modalOpen && mode === "view" && viewingQuotation ? "Quotation" : null,
    viewingQuotation?._id,
  );

  const openCreate = useCallback((presetStage) => {
    const stage = presetStage || "Draft";
    setFormData({
      ...EMPTY_FORM,
      stage,
      // probability: STAGE_PROBABILITY[stage] ?? 10,
    });
    setViewingQuotation(null);
    setMode("create");
    setModalOpen(true);
  }, []);

  const openView = useCallback((quotation) => {
    setViewingQuotation(quotation);
    setFormData(mapQuotationToForm(quotation));
    setMode("view");
    setOrigin("view");
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((quotation) => {
    setViewingQuotation(quotation);
    setFormData(mapQuotationToForm(quotation));
    setMode("edit");
    setOrigin("direct");
    setModalOpen(true);
  }, []);

  const switchToEdit = useCallback(() => {
    setMode("edit");
    setOrigin("view");
  }, []);

  const switchToView = useCallback(() => {
    if (viewingQuotation) {
      setFormData(mapQuotationToForm(viewingQuotation));
    }
    setMode("view");
  }, [viewingQuotation]);

  const closeModal = useCallback(() => {
    setActiveTab("Overview");
    setModalOpen(false);
    setViewingQuotation(null);
    setMode("create");
    setFormData(EMPTY_FORM);
    setTasks([]); // clear tasks on close
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    modalOpen,
    mode,
    origin,
    activeTab,
    setActiveTab,
    formData,
    viewingQuotation,
    activities,
    activitiesLoading,
    tasks,        
    tasksLoading, 
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