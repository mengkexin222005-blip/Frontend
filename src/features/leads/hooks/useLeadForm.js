import { useState } from "react";
import { formatDateInput } from "../../../utils/date";
import { useFormBase } from "../../../hooks/useFormBase";

const EMPTY_FORM = {
  leadAssignee: "",
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
  status: "New",
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

const DEFAULT_FOLLOW_UP = {
  enabled: false,
  subject: "",
  taskType: "Call",
  status: "To Do",
  dueDate: "",
  reminderAt: "",
  priority: "Low",
  description: "",
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

export function useLeadForm() {
  const base = useFormBase(EMPTY_FORM);
  const [showSidePane, setShowSidePane] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [followUpTask, setFollowUpTask] = useState({ ...DEFAULT_FOLLOW_UP });

  const handleFollowUpChange = (field, value) => {
    setFollowUpTask((prev) => ({ ...prev, [field]: value }));
  };

  const resetFollowUp = () => {
    setFollowUpTask({ ...DEFAULT_FOLLOW_UP });
  };

  const openCreateSidePane = () => {
    base.resetForm();
    resetFollowUp();
    setEditingLead(null);
    setShowSidePane(true);
  };

  const openEditSidePane = (lead) => {
    const addr = lead.address || {};
    const country = addr.country || "";
    const province = addr.province || "";
    const city = addr.municipality || "";

    base.setFormData({
      leadAssignee: "",
      firstName: lead.firstName || "",
      middleName: lead.middleName || "",
      lastName: lead.lastName || "",
      suffixName: lead.suffixName || "",
      birthday: formatDateInput(lead.dateOfBirth),
      gender: lead.sex || "",
      company: lead.company || "",
      leadSource: lead.leadSource || "",
      industry: lead.industry || "",
      email: lead.email || "",
      phone: formatPhone(lead.phone || ""),
      country,
      province,
      city,
      barangay: addr.barangay || "",
      street: addr.street || "",
      houseNumber: addr.houseNumber || "",
      zipCode: addr.zipCode || "",
      notes: lead.notes || "",
      status: lead.status || "New",
      removeProfilePicture: false,
    });

    base.setAddressCodes(base.resolveEditCodes(country, province, city));
    setEditingLead(lead._id);
    base.setPreviewFromPath(lead.profilePicture);
    base.setAvatar(null);
    setShowSidePane(true);
  };

  const closeSidePane = () => {
    setShowSidePane(false);
    setEditingLead(null);
    base.resetForm();
    resetFollowUp();
  };

  const buildFollowUpPayload = (leadId, formData) => {
    if (!followUpTask.enabled) return null;

    const assignedTo = formData.leadAssignee || null;
    const leadName = [formData.firstName].filter(Boolean).join(" ") || "lead";

    return {
      subject: followUpTask.subject.trim() || `Follow up with ${leadName}`,
      taskType: followUpTask.taskType,
      status: followUpTask.status,
      dueDate: followUpTask.dueDate || null,
      reminderAt: followUpTask.reminderAt || null,
      priority: followUpTask.priority,
      description: followUpTask.description,
      scope: assignedTo ? "Assigned" : "Personal",
      assignedTo,
      relatedToType: "Lead",
      relatedTo: leadId,
    };
  };

  return {
    ...base,
    showSidePane,
    editingLead,
    openCreateSidePane,
    openEditSidePane,
    closeSidePane,
    followUpTask,
    handleFollowUpChange,
    buildFollowUpPayload,
  };
}