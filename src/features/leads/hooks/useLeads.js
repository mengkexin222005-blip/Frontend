import { useState, useEffect, useCallback, useMemo } from "react";
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

const KANBAN_STATUSES = ["New", "Contacted", "Qualified", "Lost"];
const STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];

const validatePhone = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-().]/g, "");
  const isValid = /^(\+63|0)9\d{9}$|^\+?\d{10,15}$/.test(cleaned);
  return isValid ? null : "Enter a valid contact number (e.g. 09171234567 or +639171234567)";
};

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/leads");
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useSocket(
    SOCKET_EVENTS.LEAD_CREATED,
    useCallback(() => {
      fetchLeads();
    }, [fetchLeads]),
  );

  useSocket(
    SOCKET_EVENTS.LEAD_UPDATED,
    useCallback(() => {
      fetchLeads();
    }, [fetchLeads]),
  );

  useSocket(
    SOCKET_EVENTS.LEAD_ASSIGNED,
    useCallback(() => {
      fetchLeads();
    }, [fetchLeads]),
  );

  useSocket(
    SOCKET_EVENTS.LEAD_STATUS_CHANGED,
    useCallback((data) => {
      setLeads((prev) =>
        prev.map((l) =>
          l._id === data.leadId ? { ...l, status: data.newStatus } : l,
        ),
      );
    }, []),
  );

  useSocket(
    SOCKET_EVENTS.LEAD_CONVERSION_REQUESTED,
    useCallback(() => {
      fetchLeads();
    }, [fetchLeads]),
  );

  useSocket(
    SOCKET_EVENTS.LEAD_CONVERSION_APPROVED,
    useCallback(() => {
      fetchLeads();
    }, [fetchLeads]),
  );

  useSocket(
    SOCKET_EVENTS.LEAD_CONVERTED,
    useCallback(() => {
      fetchLeads();
    }, [fetchLeads]),
  );

  const columns = useMemo(
    () =>
      KANBAN_STATUSES.reduce((acc, status) => {
        acc[status] = leads
          .filter((l) => l.status === status)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        return acc;
      }, {}),
    [leads],
  );

  const createLead = async (formData, avatar, options = {}) => {
    //Validate before hitting the API
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      Swal.fire({ icon: "error", title: "Invalid Phone", text: phoneErr });
      return null;
    }

    setLoading(true);
    try {
      const data = new FormData();
      const mapped = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffixName: formData.suffixName,
        dateOfBirth: formData.birthday,
        sex: formData.gender,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        industry: formData.industry,
        leadSource: formData.leadSource,
        notes: formData.notes,
        "address.country": formData.country,
        "address.province": formData.province,
        "address.municipality": formData.city,
        "address.barangay": formData.barangay,
        "address.street": formData.street,
        "address.houseNumber": formData.houseNumber,
        "address.zipCode": formData.zipCode,
      };

      if (formData.leadAssignee) {
        mapped.leadAssignee = formData.leadAssignee;
      }

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));
      if (avatar) data.append("profilePicture", avatar);
      const { data: result } = await api.post("/api/leads", data);
      setLeads((prev) => [...prev, result.lead]);

      !options.silent &&
        Toast.fire({
          icon: "success",
          title: `Lead created successfully`,
        });

      return result;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create lead",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (_id, formData, avatar) => {
    //Validate before hitting the API
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      Swal.fire({ icon: "error", title: "Invalid Phone", text: phoneErr });
      return null;
    }

    setLoading(true);
    try {
      const data = new FormData();
      const mapped = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffixName: formData.suffixName,
        dateOfBirth: formData.birthday,
        sex: formData.gender,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        industry: formData.industry,
        leadSource: formData.leadSource,
        notes: formData.notes,
        "address.country": formData.country,
        "address.province": formData.province,
        "address.municipality": formData.city,
        "address.barangay": formData.barangay,
        "address.street": formData.street,
        "address.houseNumber": formData.houseNumber,
        "address.zipCode": formData.zipCode,
      };

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));
      if (avatar) {
        data.append("profilePicture", avatar);
      } else if (formData.removeProfilePicture) {
        data.append("removeProfilePicture", "true");
      }

      const { data: updated } = await api.patch(`/api/leads/${_id}`, data);
      setLeads((prev) =>
        prev.map((l) => (l._id === _id ? { ...l, ...updated } : l)),
      );
      Toast.fire({
        icon: "success",
        title: `Lead updated successfully`,
      });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update lead",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOwnLead = async (_id, formData, avatar) => {
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      Swal.fire({ icon: "error", title: "Invalid Phone", text: phoneErr });
      return null;
    }

    setLoading(true);
    try {
      const data = new FormData();
      const mapped = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        suffixName: formData.suffixName,
        dateOfBirth: formData.birthday,
        sex: formData.gender,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        industry: formData.industry,
        leadSource: formData.leadSource,
        notes: formData.notes,
        "address.country": formData.country,
        "address.province": formData.province,
        "address.municipality": formData.city,
        "address.barangay": formData.barangay,
        "address.street": formData.street,
        "address.houseNumber": formData.houseNumber,
        "address.zipCode": formData.zipCode,
      };

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));
      if (avatar) {
        data.append("profilePicture", avatar);
      } else if (formData.removeProfilePicture) {
        data.append("removeProfilePicture", "true");
      }

      const { data: updated } = await api.patch(`/api/leads/${_id}/self`, data);
      setLeads((prev) =>
        prev.map((l) => (l._id === _id ? { ...l, ...updated } : l)),
      );
      Toast.fire({
        icon: "success",
        title: `Lead updated successfully`,
      });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update lead",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (_id, status, position = 0, updates = []) => {
    try {
      const payload = { status, position };

      if (updates.length > 0) {
        payload.updates = updates;
      }

      const { data } = await api.patch(`/api/leads/${_id}/status`, payload);

      const updatedLead = data.lead;

      setLeads((prev) => {
        if (updates.length > 0) {
          const map = new Map(prev.map((l) => [l._id, l]));

          updates.forEach((u) => {
            if (map.has(u._id)) {
              map.set(u._id, {
                ...map.get(u._id),
                status: u.status,
                position: u.position,
              });
            }
          });

          map.set(updatedLead._id, updatedLead);

          return Array.from(map.values());
        }
        return prev.map((l) => (l._id === _id ? updatedLead : l));
      });

      Toast.fire({ icon: "success", title: `Status updated to ${status}` });
      return updatedLead;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update status",
      });
      return null;
    }
  };

  const assignLead = async (leadId, leadAssignee) => {
    try {
      const { data } = await api.patch(`/api/leads/${leadId}/assign`, {
        leadAssignee: leadAssignee ?? null,
      });
      setLeads((prev) => prev.map((l) => (l._id === leadId ? data.lead : l)));
      Toast.fire({
        icon: "success",
        title: leadAssignee
          ? "Lead assigned successfully"
          : "Assignment cleared",
      });
      return data.lead;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to assign lead",
      });
      return false;
    }
  };

  const deleteLead = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#758A93",
      confirmButtonText: "Yes, delete it!",
      toast: true,
      position: "auto",
    });

    if (!result.isConfirmed) return false;

    setLoading(true);
    try {
      await api.delete(`/api/leads/${_id}`);
      setLeads((prev) => prev.filter((l) => l._id !== _id));
      Toast.fire({ icon: "success", title: "Lead deleted successfully" });
      return true;
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete lead.",
        icon: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestLeadConversion = async (_id) => {
    const result = await Swal.fire({
      title: "Request conversion?",
      text: "This will notify your manager to review and approve.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0284c7",
      confirmButtonText: "Yes, request",
    });

    if (!result.isConfirmed) return false;

    try {
      const { data } = await api.patch(`/api/leads/${_id}/request-conversion`);
      setLeads((prev) =>
        prev.map((l) =>
          l._id === _id
            ? {
                ...l,
                conversionRequested: true,
                conversionRequestedAt: data.lead.conversionRequestedAt,
                conversionRequestedBy: data.lead.conversionRequestedBy,
              }
            : l,
        ),
      );
      Toast.fire({ icon: "success", title: "Conversion requested" });
      return data.lead;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to request conversion",
      });
      return false;
    }
  };

  const approveLeadConversion = async (_id) => {
    const result = await Swal.fire({
      title: "Approve conversion?",
      text: "The agent will be able to convert this lead to a client.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      confirmButtonText: "Approve",
    });

    if (!result.isConfirmed) return false;

    try {
      const { data } = await api.patch(`/api/leads/${_id}/approve-conversion`);
      setLeads((prev) =>
        prev.map((l) =>
          l._id === _id
            ? {
                ...l,
                conversionApproved: true,
                conversionApprovedAt: data.lead.conversionApprovedAt,
                conversionApprovedBy: data.lead.conversionApprovedBy,
              }
            : l,
        ),
      );
      Toast.fire({ icon: "success", title: "Conversion approved" });
      return data.lead;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to approve conversion",
      });
      return false;
    }
  };

  const convertLead = async (_id) => {
    try {
      const { data } = await api.post(`/api/leads/${_id}/convert`);
      setLeads((prev) =>
        prev.map((l) =>
          l._id === _id
            ? {
                ...l,
                status: "Converted",
                convertedToClient: true,
                convertedAt: data.lead.convertedAt,
                convertedBy: data.lead.convertedBy,
              }
            : l,
        ),
      );
      Swal.fire({
        icon: "success",
        title: "Lead Converted!",
        text: "Client created successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      return data.lead;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to convert lead",
      });
      return false;
    }
  };

  const reorderLeads = async (updates) => {
    const updateMap = new Map(updates.map((u) => [u._id, u]));

    setLeads((prev) =>
      prev.map((l) => {
        const upd = updateMap.get(l._id);
        return upd ? { ...l, position: upd.position } : l;
      }),
    );

    try {
      await api.patch("/api/leads/batch/reorder", { updates });
    } catch (error) {
      await fetchLeads();
      Toast.fire({
        icon: "error",
        title: "Failed to reorder leads",
      });
    }
  };

  return {
    leads,
    columns,
    loading,
    createLead,
    updateLead,
    updateOwnLead,
    updateLeadStatus,
    assignLead,
    deleteLead,
    requestLeadConversion,
    approveLeadConversion,
    convertLead,
    reorderLeads,
    KANBAN_STATUSES,
    STATUSES,
  };
}