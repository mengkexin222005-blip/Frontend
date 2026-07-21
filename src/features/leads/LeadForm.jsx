import Select from "react-select";

import { Info, UserRound } from "lucide-react";

import { getSelectProps } from "../../components/select/selectConfig";
import FormDrawer from "../../components/form/FormDrawer";
import FormSection from "../../components/form/FormSection";
import AvatarUploader from "../../components/form/AvatarUploader";
import PhAddressFields from "../../components/form/PhAddressFields";
import {
  FormLabel,
  FormInput,
  FormTextarea,
} from "../../components/form/FormField";

import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";

import {
  SUFFIX_OPTIONS,
  GENDER_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  TASK_TYPE_OPTIONS,
  TASK_PRIORITY_OPTIONS,
} from "../../constants/options";

export default function LeadForm({
  open,
  editingLead,
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
  followUpTask,
  onFollowUpChange,
}) {
  const agentOptions = salesAgents.map((u) => ({
    label: `${getDisplayName(u, { includeSuffix: true })} — ${u.role}`,
    value: u._id,
    user: u,
  }));

  const leadName = [formData.firstName].filter(Boolean).join(" ") || "Lead";
  const today = new Date().toISOString().split("T")[0];

  return (
    <FormDrawer
      open={open}
      title={editingLead ? "Edit Lead" : "Add Lead"}
      formId="lead-form"
      loading={loading}
      onClose={onClose}
      onCancel={onCancel}
    >
      <form id="lead-form" onSubmit={onSubmit} className="space-y-5">
        {/* Avatar */}
        <AvatarUploader
          preview={preview}
          onAvatarChange={onAvatarChange}
          onClearAvatar={onClearAvatar}
        />

        {/* Assignment */}
        {!editingLead && permissions.canAssign && (
          <FormSection title="Assignment">
            <div>
              <FormLabel>Assign to Agent (optional)</FormLabel>
              <Select
                {...getSelectProps({ isClearable: true })}
                options={agentOptions}
                value={
                  agentOptions.find(
                    (o) =>
                      String(o.value) === String(formData.leadAssignee || ""),
                  ) || null
                }
                onChange={(opt) =>
                  onChange({
                    target: {
                      name: "leadAssignee",
                      value: opt?.value ? String(opt.value) : "",
                    },
                  })
                }
                placeholder="Select agent to assign..."
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
                {...getSelectProps({ isSearchable: false })}
                options={SUFFIX_OPTIONS}
                value={
                  formData.suffixName
                    ? { label: formData.suffixName, value: formData.suffixName }
                    : null
                }
                onChange={(opt) =>
                  onChange({
                    target: { name: "suffixName", value: opt?.value ?? "N/A" },
                  })
                }
                placeholder="Select suffix"
              />
            </div>

            <div>
              <FormLabel>Date of Birth</FormLabel>
              <FormInput
                name="birthday"
                value={formData.birthday}
                onChange={onChange}
                type="date"
              />
            </div>

            <div>
              <FormLabel required>Gender</FormLabel>
              <Select
                {...getSelectProps({ isClearable: true })}
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

          <div className="grid grid-cols-1 gap-3">
            <div>
              <FormLabel required>Company</FormLabel>
              <FormInput
                name="company"
                value={formData.company}
                onChange={onChange}
                placeholder="e.g. ABC Corporation"
              />
            </div>
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

        {/* Follow-up Task — only shown when creating */}
        {!editingLead && (
          <FormSection title="Follow-up Task">
            {/* Checkbox toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={followUpTask.enabled}
                onChange={(e) => onFollowUpChange("enabled", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700">
                Create a follow-up task for this lead (recommended)
              </span>
            </label>
            {followUpTask.enabled && (
              <div className="mt-3 space-y-3 pl-1">
                <div>
                  <FormLabel required>Subject</FormLabel>
                  <FormInput
                    name="subject"
                    value={followUpTask.subject || `Follow up with ${leadName}`}
                    onChange={(e) =>
                      onFollowUpChange("subject", e.target.value)
                    }
                    placeholder={`Follow up with ${leadName}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormLabel required>Due Date</FormLabel>
                    <FormInput
                      name="dueDate"
                      value={followUpTask.dueDate}
                      onChange={(e) =>
                        onFollowUpChange("dueDate", e.target.value)
                      }
                      type="date"
                      required={followUpTask.enabled}
                      min={today}
                    />
                  </div>
                  <div>
                    <FormLabel>Reminder</FormLabel>
                    <FormInput
                      name="reminderAt"
                      value={followUpTask.reminderAt}
                      onChange={(e) =>
                        onFollowUpChange("reminderAt", e.target.value)
                      }
                      type="date"
                      min={today}
                      max={formData.dueDate || undefined}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      {...getSelectProps({ isSearchable: false })}
                      options={TASK_PRIORITY_OPTIONS}
                      value={
                        followUpTask.priority
                          ? {
                              label: followUpTask.priority,
                              value: followUpTask.priority,
                            }
                          : null
                      }
                      onChange={(opt) =>
                        onFollowUpChange("priority", opt?.value ?? "Low")
                      }
                    />
                  </div>
                  <div>
                    <FormLabel>Type</FormLabel>
                    <Select
                      {...getSelectProps({ isSearchable: false })}
                      options={TASK_TYPE_OPTIONS}
                      value={{
                        label: followUpTask.taskType,
                        value: followUpTask.taskType,
                      }}
                      onChange={(opt) =>
                        onFollowUpChange("taskType", opt?.value ?? "Call")
                      }
                    />
                  </div>
                </div>

                <div>
                  <FormLabel>
                    <span className="flex items-center gap-1">
                      Assign Task To
                      {permissions.canAssign && !formData.leadAssignee && (
                        <span className="relative group">
                          <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 text-xs text-white bg-gray-700 rounded-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center leading-snug">
                            Assign an agent to this lead above to delegate this
                            task
                          </span>
                        </span>
                      )}
                    </span>
                  </FormLabel>

                  <div
                    className={`flex items-center gap-2 px-3 py-2 border rounded-md min-h-9.5 ${
                      permissions.canAssign && !formData.leadAssignee
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {permissions.canAssign ? (
                      // Admin/Manager — show assigned agent or warning
                      formData.leadAssignee ? (
                        (() => {
                          const agent = agentOptions.find(
                            (o) =>
                              String(o.value) === String(formData.leadAssignee),
                          );
                          return agent ? (
                            <>
                              <img
                                src={getProfileImage(agent.user)}
                                alt="avatar"
                                className="w-5 h-5 rounded-full object-cover border shrink-0"
                              />
                              <span className="text-sm text-gray-600">
                                {getDisplayName(agent.user, {
                                  includeSuffix: true,
                                })}
                              </span>
                            </>
                          ) : null;
                        })()
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <UserRound className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-sm text-amber-600">
                            Personal task — assign an agent above to delegate
                          </span>
                        </div>
                      )
                    ) : (
                      // Agent — always personal, always theirs
                      <div className="flex items-center gap-1.5">
                        <UserRound className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-500">
                          You (personal task)
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {permissions.canAssign
                      ? formData.leadAssignee
                        ? "Automatically assigned to the selected lead agent."
                        : "This task will be saved under your personal tasks."
                      : "This task will be assigned to you."}
                  </p>
                </div>

                <div>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormTextarea
                    value={followUpTask.description}
                    onChange={(e) =>
                      onFollowUpChange("description", e.target.value)
                    }
                    placeholder={`e.g. Reach out to ${leadName} to discuss their interest and qualify the lead.`}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </FormSection>
        )}
      </form>
    </FormDrawer>
  );
}
