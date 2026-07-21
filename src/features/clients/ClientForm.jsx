import Select from "react-select";

import { getSelectProps } from "../../components/select/selectConfig";
import FormDrawer from "../../components/form/FormDrawer";
import FormSection from "../../components/form/FormSection";
import AvatarUploader from "../../components/form/AvatarUploader";
import PhAddressFields from "../../components/form/PhAddressFields";
import { FormLabel, FormInput } from "../../components/form/FormField";

import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";

import {
  SUFFIX_OPTIONS,
  GENDER_OPTIONS,
  LEAD_SOURCE_OPTIONS,
} from "../../constants/options";

export default function ClientForm({
  open,
  editingClient,
  formData,
  addressCodes,
  salesAgents = [],
  permissions = {},
  preview,
  loading,
  onChange,
  onAddressSelect,
  onAvatarChange,
  onClearAvatar,
  onSubmit,
  onClose,
  onCancel,
}) {
  const agentOptions = salesAgents.map((u) => ({
    label: `${getDisplayName(u, { includeSuffix: true })} — ${u.role}`,
    value: u._id,
    user: u,
  }));

  return (
    <FormDrawer
      open={open}
      title={editingClient ? "Edit Client" : "Add Client"}
      formId="client-form"
      loading={loading}
      onClose={onClose}
      onCancel={onCancel}
    >
      <form id="client-form" onSubmit={onSubmit} className="space-y-5">
        <AvatarUploader
          preview={preview}
          onAvatarChange={onAvatarChange}
          onClearAvatar={onClearAvatar}
        />

        {/* Assignment — create mode only */}
        {!editingClient && permissions.canAssign && (
          <FormSection title="Assignment">
            <div>
              <FormLabel>Account owner (optional)</FormLabel>
              <Select
                {...getSelectProps({ isClearable: true })}
                options={agentOptions}
                value={
                  agentOptions.find(
                    (o) =>
                      String(o.value) === String(formData.assignedTo || ""),
                  ) || null
                }
                onChange={(opt) =>
                  onChange({
                    target: {
                      name: "assignedTo",
                      value: opt?.value ? String(opt.value) : "",
                    },
                  })
                }
                placeholder="Select sales agent…"
                formatOptionLabel={({ user }) => (
                  <div className="flex items-center gap-2">
                    <img
                      src={getProfileImage(user)}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover border"
                    />
                    <span>{getDisplayName(user, { includeSuffix: true })}</span>
                  </div>
                )}
              />
            </div>
          </FormSection>
        )}

        {/* Personal Information */}
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
              <FormLabel>Suffix (Optional)</FormLabel>
              <Select
                {...getSelectProps()}
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
              />
            </div>
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
          </div>

          <div>
            <FormLabel required>Company</FormLabel>
            <FormInput
              name="company"
              value={formData.company}
              onChange={onChange}
              placeholder="e.g. ABC Corporation"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormLabel required>Lead Source</FormLabel>
              <Select
                {...getSelectProps({ isSearchable: false })}
                options={LEAD_SOURCE_OPTIONS}
                value={
                  formData.leadSource
                    ? { label: formData.leadSource, value: formData.leadSource }
                    : null
                }
                onChange={(opt) =>
                  onChange({
                    target: { name: "leadSource", value: opt?.value ?? "" },
                  })
                }
                placeholder="Select lead source"
              />
            </div>
            <div>
              <FormLabel required>Industry</FormLabel>
              <FormInput
                name="industry"
                value={formData.industry}
                onChange={onChange}
                placeholder="e.g. Technology, Marketing, etc."
              />
            </div>
            <div>
              <FormLabel required>Status</FormLabel>
              <Select
                {...getSelectProps({ isSearchable: false })}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                  { label: "Lost", value: "Lost" },
                ]}
                value={
                  formData.status
                    ? { label: formData.status, value: formData.status }
                    : null
                }
                onChange={(opt) =>
                  onChange({
                    target: { name: "status", value: opt?.value ?? "Active" },
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <FormLabel>Notes</FormLabel>
              <textarea
                name="notes"
                value={formData.notes ?? ""}
                onChange={onChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Internal notes…"
              />
            </div>
          </div>
        </FormSection>

        {/* Address Information */}
        <FormSection title="Address Information">
          <PhAddressFields
            formData={formData}
            addressCodes={addressCodes}
            onAddressSelect={onAddressSelect}
            onChange={onChange}
          />
        </FormSection>

        {/* Account Creation */}
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
      </form>
    </FormDrawer>
  );
}
