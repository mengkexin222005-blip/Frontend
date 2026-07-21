import { useState } from "react";
import Swal from "sweetalert2";
import { formatDateInput } from "../../../utils/date";
import { useFormBase } from "../../../hooks/useFormBase";

const EMPTY_FORM = {
  team: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffixName: "",
  birthday: "",
  placeOfBirth: "",
  gender: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  phone: "",
  country: "",
  province: "",
  city: "",
  barangay: "",
  street: "",
  houseNumber: "",
  zipCode: "",
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

export function useUserForm() {
  const base = useFormBase(EMPTY_FORM);
  const [showSidePane, setShowSidePane] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const openCreateSidePane = () => {
    if (!editingUser) {
      setShowSidePane(true);
      return;
    }
    base.resetForm();
    setEditingUser(null);
    setShowSidePane(true);
  };

  const openEditSidePane = (user) => {
    if (showSidePane && editingUser === user.employeeId) {
      setShowSidePane(true);
      return;
    }
    const addr = user.currentAddress ?? {};
    const country = addr.country ?? "";
    const province = addr.province ?? "";
    const city = addr.municipality ?? "";

    base.setFormData({
      team: user.team?._id || user.team || "",
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      suffixName: user.suffixName || "",
      birthday: formatDateInput(user.dateOfBirth),
      placeOfBirth: user.placeOfBirth || "",
      gender: user.sex || "",
      email: user.email || "",
      role: user.role || "",
      phone: formatPhone(user.phone || ""), 
      country,
      province,
      city,
      barangay: addr.barangay || "",
      street: addr.street || "",
      houseNumber: addr.houseNumber || "",
      zipCode: addr.zipCode || "",
      password: "",
      confirmPassword: "",
      removeProfilePicture: false,
    });

    base.setAddressCodes(base.resolveEditCodes(country, province, city));
    setEditingUser(user.employeeId);
    base.setPreviewFromPath(user.profilePicture);
    base.setAvatar(null);
    setShowSidePane(true);
  };

  const resetAndClose = () => {
    setShowSidePane(false);
    setEditingUser(null);
    base.resetForm();
  };

  const closeSidePane = () => {
    setShowSidePane(false);
  };

  const validatePasswords = () => {
    if (base.formData.password !== base.formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Passwords do not match" });
      return false;
    }
    return true;
  };

  return {
    ...base,
    showSidePane,
    editingUser,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    openCreateSidePane,
    openEditSidePane,
    resetAndClose,
    closeSidePane,
    validatePasswords,
  };
}