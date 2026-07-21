﻿import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import api from "../../../services/api";
import { useSocket } from "../../../hooks/useSocket";
import { SOCKET_EVENTS } from "../../../constants/socketEvents";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: "auto",
});

const STAGES = [
  "Draft",
  "Sent",
  "Under Review",
  "Negotiation",
  "Rejected",
  "Expired",
];

export function useQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuotations = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/quotations");
      setQuotations(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  useSocket(
    SOCKET_EVENTS.QUOTATION_CREATED,
    useCallback(() => {
      fetchQuotations();
    }, [fetchQuotations]),
  );

  useSocket(
    SOCKET_EVENTS.QUOTATION_UPDATED,
    useCallback(() => {
      fetchQuotations();
    }, [fetchQuotations]),
  );

  useSocket(
    SOCKET_EVENTS.QUOTATION_ASSIGNED,
    useCallback(() => {
      fetchQuotations();
    }, [fetchQuotations]),
  );

  useSocket(
    SOCKET_EVENTS.QUOTATION_STAGE_CHANGED,
    useCallback((data) => {
      setQuotations((prev) =>
        prev.map((d) =>
          d._id === data.quotationId ? { ...d, stage: data.newStage } : d,
        ),
      );
    }, []),
  );

  // Group quotations by stage for the Kanban board, sorted by position
  const columns = useMemo(
    () =>
      STAGES.reduce((acc, stage) => {
        acc[stage] = quotations
          .filter((d) => d.stage === stage)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        return acc;
      }, {}),
    [quotations],
  );

  const updateQuotationStage = async (
    quotationId,
    newStage,
    position = 0,
    updates = [],
  ) => {
    // Optimistic update
    setQuotations((prev) =>
      prev.map((d) => (d._id === quotationId ? { ...d, stage: newStage } : d)),
    );

    try {
      const payload = { stage: newStage, position };
      if (updates.length > 0) payload.updates = updates;

      const { data } = await api.patch(`/api/quotations/${quotationId}/stage`, payload);
      const updatedQuotation = data.quotation;

      setQuotations((prev) => {
        if (updates.length > 0) {
          const map = new Map(prev.map((d) => [d._id, d]));
          updates.forEach((u) => {
            if (map.has(u._id)) {
              map.set(u._id, {
                ...map.get(u._id),
                stage: u.stage ?? map.get(u._id).stage,
                position: u.position,
              });
            }
          });
          map.set(updatedQuotation._id, updatedQuotation);
          return Array.from(map.values());
        }
        return prev.map((d) => (d._id === quotationId ? updatedQuotation : d));
      });
    } catch (error) {
      await fetchQuotations();
      Toast.fire({
        icon: "error",
        title: error.response?.data?.error || "Failed to update quotation stage",
      });
    }
  };

  const createQuotation = async (formData) => {
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        client: formData.client,
        value: Number(formData.value),
        currency: formData.currency || "PHP",
        // probability: Number(formData.probability) || 0,
        stage: formData.stage || "Draft",
        expectedCloseDate: formData.expectedCloseDate || null,
        notes: formData.notes || "",
      };
      if (formData.assignedTo) {
        payload.assignedTo = formData.assignedTo;
      }

      const { data: result } = await api.post("/api/quotations", payload);
      setQuotations((prev) => [result.quotation, ...prev]);
      Toast.fire({ icon: "success", title: "Quotation created successfully" });
      return result.quotation;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create quotation",
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const updateQuotation = async (quotationId, formData) => {
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        client: formData.client,
        value: Number(formData.value),
        currency: formData.currency || "PHP",
        // probability: Number(formData.probability) || 0,
        stage: formData.stage,
        expectedCloseDate: formData.expectedCloseDate || null,
        notes: formData.notes || "",
      };
      if (formData.assignedTo !== undefined) {
        payload.assignedTo = formData.assignedTo || null;
      }

      const { data: updated } = await api.patch(
        `/api/quotations/${quotationId}`,
        payload,
      );
      setQuotations((prev) => prev.map((d) => (d._id === quotationId ? updated : d)));
      Toast.fire({ icon: "success", title: "Quotation updated successfully" });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update quotation",
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteQuotation = async (quotationId) => {
    const confirm = await Swal.fire({
      title: "Delete this quotation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return false;

    try {
      await api.delete(`/api/quotations/${quotationId}`);
      setQuotations((prev) => prev.filter((d) => d._id !== quotationId));
      Toast.fire({ icon: "success", title: "Quotation deleted successfully" });
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to delete quotation",
      });
      return false;
    }
  };

  const reorderQuotations = async (updates) => {
    const updateMap = new Map(updates.map((u) => [u._id, u]));

    setQuotations((prev) =>
      prev.map((d) => {
        const upd = updateMap.get(d._id);
        if (!upd) return d;
        return { ...d, position: upd.position, stage: upd.stage ?? d.stage };
      }),
    );

    try {
      await api.patch("/api/quotations/batch/reorder", { updates });
    } catch (error) {
      await fetchQuotations();
      Toast.fire({
        icon: "error",
        title:
          error.response?.data?.error || "Failed to reorder quotations",
      });
    }
  };

  return {
    quotations,
    columns,
    loading,
    submitting,
    fetchQuotations,
    updateQuotationStage,
    reorderQuotations,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    STAGES,
  };
}

