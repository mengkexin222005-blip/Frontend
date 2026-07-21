import { useState } from "react";
import { formatDateInput } from "../../../utils/date";
import { useFormBase } from "../../../hooks/useFormBase";

const EMPTY_FORM = {
  assignedTo: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffixName: "",
  birthday: "",
  gender: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  leadSource: "",
  status: "Active",
  country: "",
  province: "",
  city: "",
  barangay: "",
  street: "",
  houseNumber: "",
  zipCode: "",
  notes: "",
  removeProfilePicture: false,
};

const formatPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  if (/^09\d{9}$/.test(cleaned)) {
    return cleaned.replace(/^(09\d{2})(\d{3})(\d{4})$/, "$1 $2 $3");
  }

  if (/^639\d{9}$/.test(cleaned)) {
    return cleaned.replace(/^(63)(9\d{2})(\d{3})(\d{4})$/, "+$1 $2 $3 $4");
  }

  return phone;
};

export function useClientForm() {
  const base = useFormBase(EMPTY_FORM);
  const [showSidePane, setShowSidePane] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const openCreateSidePane = () => {
    base.resetForm();
    setEditingClient(null);
    setShowSidePane(true);
  };

  const openEditSidePane = (client) => {
    const addr = client.address || {};
    const country = addr.country || "";
    const province = addr.province || "";
    const city = addr.municipality || "";

    base.setFormData({
      assignedTo: "",
      firstName: client.firstName || "",
      middleName: client.middleName || "",
      lastName: client.lastName || "",
      suffixName: client.suffixName || "",
      birthday: formatDateInput(client.dateOfBirth),
      gender: client.sex || "",
      company: client.company || "",
      leadSource: client.leadSource || "",
      industry: client.industry || "",
      email: client.email || "",
      phone: formatPhone(client.phone || ""), 
      country,
      province,
      city,
      barangay: addr.barangay || "",
      street: addr.street || "",
      houseNumber: addr.houseNumber || "",
      zipCode: addr.zipCode || "",
      notes: client.notes || "",
      status: client.status || "Active",
      removeProfilePicture: false,
    });

    base.setAddressCodes(base.resolveEditCodes(country, province, city));
    setEditingClient(client._id);
    base.setPreviewFromPath(
      client.profilePicture
        ? `http://localhost:5000${client.profilePicture}`
        : "",
    );
    base.setAvatar(null);
    setShowSidePane(true);
  };

  const closeSidePane = () => {
    setShowSidePane(false);
    setEditingClient(null);
    base.resetForm();
  };

  return {
    ...base,
    showSidePane,
    editingClient,
    openCreateSidePane,
    openEditSidePane,
    closeSidePane,
  };
}