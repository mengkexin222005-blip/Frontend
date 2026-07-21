import { useState, useEffect, useCallback } from "react";
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

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/clients");
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useSocket(
    SOCKET_EVENTS.CLIENT_CREATED,
    useCallback(() => {
      fetchClients();
    }, [fetchClients]),
  );

  useSocket(
    SOCKET_EVENTS.CLIENT_UPDATED,
    useCallback(() => {
      fetchClients();
    }, [fetchClients]),
  );

  useSocket(
    SOCKET_EVENTS.CLIENT_ASSIGNED,
    useCallback(() => {
      fetchClients();
    }, [fetchClients]),
  );

  useSocket(
    SOCKET_EVENTS.CLIENT_STATUS_CHANGED,
    useCallback((data) => {
      setClients((prev) =>
        prev.map((c) =>
          c._id === data.clientId ? { ...c, status: data.newStatus } : c,
        ),
      );
    }, []),
  );

  const createClient = async (formData, avatar) => {
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
        status: formData.status || "Active",
        notes: formData.notes,
        "address.country": formData.country,
        "address.province": formData.province,
        "address.municipality": formData.city,
        "address.barangay": formData.barangay,
        "address.street": formData.street,
        "address.houseNumber": formData.houseNumber,
        "address.zipCode": formData.zipCode,
      };

      if (formData.assignedTo) {
        mapped.assignedTo = formData.assignedTo;
      }

      Object.keys(mapped).forEach((key) => data.append(key, mapped[key] ?? ""));
      if (avatar) data.append("profilePicture", avatar);

      const { data: result } = await api.post("/api/clients", data);
      setClients((prev) => [...prev, result.client]);
      Toast.fire({
        icon: "success",
        title: `Client created successfully`,
      });
      return result;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create client",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (_id, formData, avatar) => {
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
        status: formData.status || "Active",
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

      const { data: updated } = await api.patch(`/api/clients/${_id}`, data);
      setClients((prev) => prev.map((c) => (c._id === _id ? updated : c)));
      Toast.fire({
        icon: "success",
        title: `Client updated successfully`,
      });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update client",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const assignClient = async (clientId, assignedTo) => {
    try {
      const { data: updated } = await api.patch(
        `/api/clients/${clientId}/assign`,
        { assignedTo: assignedTo || null },
      );
      setClients((prev) =>
        prev.map((c) => (c._id === clientId ? updated : c)),
      );
      Toast.fire({ icon: "success", title: "Assignment updated" });
      return updated;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update assignment",
      });
      return false;
    }
  };

  const deleteClient = async (_id) => {
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
      await api.delete(`/api/clients/${_id}`);
      setClients((prev) => prev.filter((c) => c._id !== _id));
      Swal.fire({
        title: "Deleted!",
        text: "Client has been deleted.",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
      return true;
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete client.",
        icon: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId, status) => {
    // Optimistic update
    setClients((prev) =>
      prev.map((c) => (c._id === clientId ? { ...c, status } : c)),
    );

    try {
      const { data: updated } = await api.patch(
        `/api/clients/${clientId}/status`,
        { status },
      );
      setClients((prev) =>
        prev.map((c) => (c._id === clientId ? updated : c)),
      );
      Toast.fire({ icon: "success", title: `Status updated to ${status}` });
      return updated;
    } catch (error) {
      await fetchClients(); // rollback on failure
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update client status",
      });
      return null;
    }
  };

  return {
    clients,
    loading,
    refetchClients: fetchClients,
    createClient,
    updateClient,
    assignClient,
    deleteClient,
    updateClientStatus,
  };
}
