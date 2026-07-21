import Select from "react-select";
import { getSelectProps } from "../../components/select/selectConfig";

import FormDrawer from "../../components/form/FormDrawer";
import FormSection from "../../components/form/FormSection";
import { FormLabel, FormInput } from "../../components/form/FormField";

import { getDisplayName } from "../../utils/name";
import { getProfileImage } from "../../utils/avatar";

const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

/**
 * Build a react-select option from a user object.
 */
function userOption(user) {
  return {
    value: user._id,
    label: getDisplayName(user, {
      includeMiddleInitial: true,
      includeSuffix: true,
    }),
    user,
  };
}

function UserOptionLabel({ user }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={getProfileImage(user)}
        alt=""
        className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0"
      />
      <span className="text-sm">
        {getDisplayName(user, {
          includeMiddleInitial: true,
          includeSuffix: true,
        })}
      </span>
    </div>
  );
}

export default function TeamForm({
  open,
  editingTeam,
  formData,
  loading,
  managers, // User[] with role "Sales Manager"
  agents, // User[] with role "Sales Agent"
  onChange,
  onManagerChange,
  onAgentsChange,
  onStatusChange,
  onSubmit,
  onClose,
  onCancel,
}) {
  const managerOptions = managers.map(userOption);
  const agentOptions = agents.map(userOption);

  const selectedManager =
    managerOptions.find((o) => o.value === formData.manager) || null;

  const selectedAgents = agentOptions.filter((o) =>
    formData.agents.includes(o.value),
  );

  const selectedStatus =
    STATUS_OPTIONS.find((o) => o.value === formData.isActive) ||
    STATUS_OPTIONS[0];

  return (
    <FormDrawer
      open={open}
      title={editingTeam ? "Edit Team" : "Add Team"}
      formId="team-form"
      loading={loading}
      onClose={onClose}
      onCancel={onCancel}
    >
      <form id="team-form" onSubmit={onSubmit} className="space-y-5">
        <FormSection title="Team Details">
          <div>
            <FormLabel required>Team Name</FormLabel>
            <FormInput
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              placeholder="e.g. Alpha Sales Team"
            />
          </div>

          <div>
            <FormLabel>Description</FormLabel>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Brief description of this team's focus or territory..."
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
            />
          </div>

          <div>
            <FormLabel required>Status</FormLabel>
            <Select
              {...getSelectProps({ isSearchable: false })}
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(opt) => onStatusChange(opt?.value ?? true)}
              placeholder="Select status"
            />
          </div>
        </FormSection>

        <FormSection title="Team Members">
          <div>
            <FormLabel required>Sales Manager</FormLabel>
            <Select
              {...getSelectProps({ isSearchable: true })}
              options={managerOptions}
              value={selectedManager}
              onChange={(opt) => onManagerChange(opt?.value ?? "")}
              placeholder="Select a manager..."
              formatOptionLabel={({ user }) => <UserOptionLabel user={user} />}
              required
              isClearable
            />
          </div>

          <div>
            <FormLabel>Sales Agents</FormLabel>
            <Select
              {...getSelectProps({ isSearchable: true })}
              isMulti
              options={agentOptions}
              value={selectedAgents}
              onChange={(opts) =>
                onAgentsChange((opts || []).map((o) => o.value))
              }
              placeholder="Select agents..."
              formatOptionLabel={({ user }) => <UserOptionLabel user={user} />}
              closeMenuOnSelect={false}
            />
            {selectedAgents.length > 0 && (
              <p className="text-xs text-gray-400 mt-1.5">
                {selectedAgents.length} agent
                {selectedAgents.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </FormSection>
      </form>
    </FormDrawer>
  );
}
