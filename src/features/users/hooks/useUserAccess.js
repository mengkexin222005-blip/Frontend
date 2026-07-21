import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api"; 
import Swal from "sweetalert2";

const ALL_ACCESS = [
  "Dashboard", "Leads", "Clients", "Quotations", "Tasks",
  "Meetings", "Calls", "Settings", "Reports", "Prospects",
];

const isProtectedAdminRole = (role) => ["Super Admin", "Admin"].includes(role);

const ROLE_ACCESS = {
  "Super Admin": ALL_ACCESS,
  Admin: ALL_ACCESS,
  "Sales Manager": [
    "Dashboard", "Leads", "Clients", "Quotations",
    "Tasks", "Meetings", "Calls", "Settings",
  ],
  "Sales Agent": [
    "Dashboard", "Leads", "Clients", "Quotations", "Tasks", "Meetings", "Calls",
  ],
  "Support Staff": ["Dashboard", "Clients", "Tasks", "Meetings", "Calls"],
};

export default function useUserAccess() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUserData] = useState(null); 
  const [roleTemplate, setRoleTemplateState] = useState("");
  const [access, setAccess] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDropdownUsers = async () => {
      try {
        const response = await api.get("/api/users");
        const fetchedUsers = Array.isArray(response.data) ? response.data : response.data?.users || [];
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to load user list for dropdown selection:", error);
      }
    };
    fetchDropdownUsers();
  }, []);

  const selectedAccess = useMemo(
    () => ALL_ACCESS.filter(item => access.includes(item)),
    [access],
  );

  const unselectedAccess = useMemo(
    () => ALL_ACCESS.filter(item => !access.includes(item)),
    [access],
  );

  const setSelectedUser = async (id) => {
    if (!id) {
      setSelectedUserId("");
      setSelectedUserData(null);
      setRoleTemplateState("");
      setAccess([]);
      return;
    }

    setSelectedUserId(id);

    try {
      const response = await api.get(`/api/users/${id}/details`);
      const data = response.data;

      setSelectedUserData(data);
      
      const currentRole = data.role || "";
      setRoleTemplateState(currentRole);

      const hasPersistedAccessModules = Object.prototype.hasOwnProperty.call(
        data,
        "accessModules",
      );

      if (hasPersistedAccessModules && Array.isArray(data.accessModules)) {
        setAccess(data.accessModules);
      } else if (currentRole && ROLE_ACCESS[currentRole]) {
        setAccess([...ROLE_ACCESS[currentRole]]);
      } else {
        setAccess([]);
      }
    } catch (error) {
      console.error("Failed to load chosen user permission mappings:", error);
    }
  };

  const showAdminRestrictionAlert = () => {
    Swal.fire({
      icon: "warning",
      title: "Action Restricted",
      text: "Only Super Admin can modify Admin-level access.",
      confirmButtonColor: "#dc2626"
    });
  };

  const canEditSelectedUser = () => {
    if (!selectedUser) return false;
    if (currentUser?.role === "Super Admin") return true;
    if (currentUser?.role === "Admin" && isProtectedAdminRole(selectedUser.role)) {
      return false;
    }
    return true;
  };

  const setRoleTemplate = (value) => {
    if (!canEditSelectedUser()) {
      showAdminRestrictionAlert();
      return;
    }

    setRoleTemplateState(value);
    if (value && ROLE_ACCESS[value]) {
      setAccess([...ROLE_ACCESS[value]]);
    } else {
      setAccess([]);
    }
  };

  const toggleAccess = (item) => {
    if (!canEditSelectedUser()) {
      showAdminRestrictionAlert();
      return;
    }

    setAccess(previous =>
      previous.includes(item)
        ? previous.filter(accessItem => accessItem !== item)
        : [...previous, item],
    );
  };

  const cancelChanges = () => {
    if (selectedUserId) {
      setSelectedUser(selectedUserId);
    }
  };

  const saveAccess = async () => {
    if (!selectedUserId) return false;

    if (!canEditSelectedUser()) {
      showAdminRestrictionAlert();
      return false;
    }

    setSaving(true);
    
    try {
      const payload = {
        role: roleTemplate,
        accessModules: access,
      };

      await api.patch(`/api/users/${selectedUserId}/access`, payload);

      setSelectedUserData(prev => ({ 
        ...prev, 
        role: roleTemplate, 
        accessModules: access 
      }));

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Access permissions saved successfully",
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
      });

      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Save Operation Failed",
        text: error.response?.data?.error || "Unable to save module permission variations.",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    users,
    selectedUserId,
    selectedUser,
    setSelectedUser,
    roleTemplate,
    setRoleTemplate,
    access,
    selectedAccess,
    unselectedAccess,
    toggleAccess,
    saveAccess,
    cancelChanges,
    saving,
  };
}