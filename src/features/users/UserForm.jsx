import { useMemo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Select from "react-select";

import { getSelectProps } from "../../components/select/selectConfig";
import FormDrawer from "../../components/form/FormDrawer";
import FormSection from "../../components/form/FormSection";
import AvatarUploader from "../../components/form/AvatarUploader";
import PhAddressFields from "../../components/form/PhAddressFields";
import { FormLabel, FormInput } from "../../components/form/FormField";
import { SUFFIX_OPTIONS, GENDER_OPTIONS } from "../../constants/options";
import { useAuth } from "../../context/AuthContext";

const ROLE_OPTIONS = [
  { label: "Super Admin", value: "Super Admin" },
  { label: "Admin", value: "Admin" },
  { label: "Sales Manager", value: "Sales Manager" },
  { label: "Sales Agent", value: "Sales Agent" },
  { label: "Support Staff", value: "Support Staff" },
];

function useTeamOptions(role, teams) {
  return useMemo(() => {
    if (role === "Sales Agent") {
      return teams
        .filter((t) => t.isActive)
        .map((t) => ({ label: t.name, value: t._id }));
    }
    return [];
  }, [role, teams]);
}
export default function UserForm({
  open,
  editingUser, // employeeId string | null
  formData,
  addressCodes,
  preview,
  loading,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onChange,
  onAddressSelect,
  onAvatarChange,
  onClearAvatar,
  onSubmit,
  onClose,
  onCancel,
  teams = [],
}) {
  const role = formData.role;
  const showTeamField = false;
  const { user: authUser } = useAuth();

  const roleOptions = useMemo(() => {
    const baseOptions = ROLE_OPTIONS.filter(
      (option) =>
        authUser?.role === "Super Admin" || option.value !== "Super Admin",
    );

    if (
      editingUser &&
      authUser?.role !== "Super Admin" &&
      formData.role === "Super Admin"
    ) {
      return [{ label: "Super Admin", value: "Super Admin" }, ...baseOptions];
    }

    return baseOptions;
  }, [authUser?.role, editingUser, formData.role]);

  const teamOptions = useTeamOptions(role, teams);

  const selectedTeam =
    teamOptions.find((o) => o.value === formData.team) || null;

  return (
    <FormDrawer
      open={open}
      title={editingUser ? "Edit User Account" : "Add User Account"}
      formId="user-form"
      loading={loading}
      onClose={onClose}
      onCancel={onCancel}
    >
      <form id="user-form" onSubmit={onSubmit} className="space-y-5">
        <AvatarUploader
          preview={preview}
          onAvatarChange={onAvatarChange}
          onClearAvatar={onClearAvatar}
        />

        {/* ── Personal Information ─────────────────────────────────── */}
        <FormSection title="Personal Information">
          <div className="grid grid-cols-3 gap-3">
            {[
              ["firstName", "First Name", true, "e.g. Juan"],
              ["middleName", "Middle Name", false, "e.g. Dela"],
              ["lastName", "Last Name", true, "e.g. Cruz"],
            ].map(([name, label, req, placeholder]) => (
              <div key={name}>
                <FormLabel required={req}>{label}</FormLabel>
                <FormInput
                  name={name}
                  value={formData[name]}
                  onChange={onChange}
                  required={req}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <FormLabel>Suffix</FormLabel>
              <Select
                {...getSelectProps({ isSearchable: false })}
                options={SUFFIX_OPTIONS}
                value={
                  formData.suffixName
                    ? { label: formData.suffixName, value: formData.suffixName }
                    : null
                }
                onChange={(opt) =>
                  onChange({
                    target: { name: "suffixName", value: opt?.value ?? "" },
                  })
                }
                placeholder="Select suffix"
              />
            </div>
            <div>
              <FormLabel required>Date of Birth</FormLabel>
              <FormInput
                name="birthday"
                value={formData.birthday}
                onChange={onChange}
                type="date"
                required
                min="1900-01-01"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <FormLabel required>Place of Birth</FormLabel>
              <FormInput
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={onChange}
                placeholder="e.g. Legazpi City, Albay"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormLabel required>Gender</FormLabel>
              <Select
                {...getSelectProps({ isSearchable: false })}
                options={GENDER_OPTIONS}
                value={
                  formData.gender
                    ? { label: formData.gender, value: formData.gender }
                    : null
                }
                onChange={(opt) =>
                  onChange({
                    target: { name: "gender", value: opt?.value ?? "" },
                  })
                }
                placeholder="Select gender"
              />
            </div>
            <div>
              <FormLabel required>Contact Number</FormLabel>
              <FormInput
                name="phone"
                value={formData.phone}
                onChange={onChange}
                type="tel"
                placeholder="e.g. 09123456789"
                required
              />
            </div>
          </div>
        </FormSection>

        {/* ── Address Information ──────────────────────────────────── */}
        <FormSection title="Address Information">
          <PhAddressFields
            formData={formData}
            addressCodes={addressCodes}
            onAddressSelect={onAddressSelect}
            onChange={onChange}
          />
        </FormSection>

        {/* ── Account Creation ─────────────────────────────────────── */}
        <FormSection title="Account Creation">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormLabel required>Email</FormLabel>
              <FormInput
                name="email"
                value={formData.email}
                onChange={onChange}
                type="email"
                placeholder="e.g. juan@email.com"
                required
              />
            </div>
            <div>
              <FormLabel required>Select Role</FormLabel>
              <Select
                {...getSelectProps({ isSearchable: true })}
                options={roleOptions}
                value={
                  formData.role
                    ? { label: formData.role, value: formData.role }
                    : null
                }
                onChange={(opt) => {
                  // When role changes, clear the team so a stale selection
                  // from a previous role isn't accidentally submitted.
                  onChange({
                    target: { name: "role", value: opt?.value ?? "" },
                  });
                  onChange({ target: { name: "team", value: "" } });
                }}
                placeholder="Select role"
                noOptionsMessage={() => "No matching roles"}
              />
            </div>
          </div>

          {/* ── Team assignment  */}
          {showTeamField && (
            <div>
              <FormLabel>Assign to Team (Optional)</FormLabel>

              <Select
                {...getSelectProps({ isSearchable: true })}
                options={teamOptions}
                value={selectedTeam}
                onChange={(opt) =>
                  onChange({
                    target: { name: "team", value: opt?.value ?? "" },
                  })
                }
                placeholder="Select a team ..."
                isClearable
                noOptionsMessage={() => "No teams available"}
              />
            </div>
          )}

          {/* ── Password fields (create only) ────────────────────── */}
          {!editingUser && (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  name: "password",
                  label: "Password",
                  show: showPassword,
                  toggle: () => setShowPassword((p) => !p),
                },
                {
                  name: "confirmPassword",
                  label: "Confirm Password",
                  show: showConfirmPassword,
                  toggle: () => setShowConfirmPassword((p) => !p),
                },
              ].map(({ name, label, show, toggle }) => (
                <div key={name}>
                  <FormLabel required>{label}</FormLabel>
                  <div className="relative">
                    <FormInput
                      name={name}
                      value={formData[name]}
                      onChange={onChange}
                      type={show ? "text" : "password"}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-9 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <span
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                                 text-gray-400 hover:text-gray-600"
                    >
                      {show ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </FormSection>
      </form>
    </FormDrawer>
  );
}
