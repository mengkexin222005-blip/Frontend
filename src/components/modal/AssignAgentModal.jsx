import { useMemo, useState } from "react";
import Select from "react-select";

import BaseModal from "./BaseModal";

import { getSelectProps } from "../select/selectConfig";
import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";

import UserCard from "../view/ViewUserCard";

/**
 * AssignAgentModal
 *
 * Shared modal for assigning or reassigning a sales agent.
 * Used by LeadView (assign lead), ClientView (reassign account owner),
 * and ManageTeamModal (assign agent to team).
 *
 * @prop {boolean}         open                - controls visibility
 * @prop {object|null}     currentAssignee      - currently assigned user object (or null)
 * @prop {object[]}        salesAgents         - list of available sales agent user objects
 * @prop {string}          title               - modal heading
 * @prop {string}          subtitle            - modal sub-description
 * @prop {string}          currentLabel        - label shown above the current assignee card
 * @prop {string}          selectLabel         - label shown above the agent select
 * @prop {string}          confirmLabel        - confirm button label (e.g. "Assign", "Save reassignment")
 * @prop {string}          confirmingLabel     - label while submitting (e.g. "Saving…")
 * @prop {string}          confirmColor        - tailwind bg class for confirm button (default: "bg-sky-600 hover:bg-sky-700")
 * @prop {boolean}         hideCurrentAssignee - when true, hides the "current assignee" section entirely (default: false)
 * @prop {(agentId) => Promise<boolean>} onConfirm - called with selected agent id (or null to clear)
 * @prop {() => void}      onClose             - called to close the modal
 */
export default function AssignAgentModal({
  open,
  currentAssignee = null,
  salesAgents = [],
  title,
  subtitle,
  currentLabel = "Current",
  selectLabel,
  confirmLabel = "Save",
  confirmingLabel = "Saving…",
  confirmColor = "bg-red-500 hover:bg-red-600",
  hideCurrentAssignee = false,
  onConfirm,
  onClose,
  modalPosition = "top",
}) {
  const [submitting, setSubmitting] = useState(false);
  const [selection, setSelection] = useState("");

  // Keep selection in sync when modal first becomes visible
  if (open && selection === "" && currentAssignee) {
    const raw = currentAssignee?._id ?? currentAssignee;
    if (raw) setSelection(String(raw));
  }

  const hasAssignee = Boolean(currentAssignee);

  const agentSelectOptions = useMemo(
    () =>
      salesAgents.map((u) => ({
        label: `${getDisplayName(u, { includeSuffix: true })} — ${u.role}`,
        value: String(u._id),
        user: u,
      })),
    [salesAgents],
  );

  const selectedOption =
    agentSelectOptions.find((o) => o.value === selection) || null;

  const handleConfirm = async () => {
    if (!selection && !hasAssignee) return;
    setSubmitting(true);
    try {
      const success = await onConfirm?.(selection || null);
      if (success) {
        setSelection("");
        onClose?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = async () => {
    setSubmitting(true);
    try {
      const success = await onConfirm?.(null);
      if (success) {
        setSelection("");
        onClose?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <BaseModal
        open={open}
        submitting={submitting}
        onClose={onClose}
        closeOnBackdrop={false}
        position={modalPosition}
        maxWidth="max-w-md"
        zIndex={110}
      >
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}

        {/* Current assignee — hidden when hideCurrentAssignee is true */}
        {!hideCurrentAssignee && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              {currentLabel}
            </p>
            {hasAssignee ? (
              <UserCard user={currentAssignee} label={currentLabel} />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-400 italic">
                  No agent assigned
                </p>
              </div>
            )}
          </div>
        )}

        {/* Agent select */}
        <div className="mt-4">
          {selectLabel && (
            <p className="text-xs font-medium text-gray-600 mb-1.5">
              {selectLabel}
            </p>
          )}
          {salesAgents.length === 0 ? (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              No sales agents found.
            </p>
          ) : (
            <Select
              {...getSelectProps({ theme: "red", isClearable: true })}
              options={agentSelectOptions}
              value={selectedOption}
              onChange={(opt) =>
                setSelection(opt?.value ? String(opt.value) : "")
              }
              placeholder="Search or select an agent…"
              formatOptionLabel={({ user }) => (
                <div className="flex items-center gap-2">
                  <img
                    src={getProfileImage(user)}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover border"
                  />
                  <span>{getDisplayName(user, { includeSuffix: true })}</span>
                </div>
              )}
            />
          )}
        </div>

        {/* Clear link — only shown when there's a current assignee and it's visible */}
        {!hideCurrentAssignee && hasAssignee && (
          <div className="mt-3">
            <button
              type="button"
              disabled={submitting}
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-red-600 underline cursor-pointer disabled:opacity-50"
            >
              Clear assignment
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium border border-red-300 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting || !selection || salesAgents.length === 0}
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors cursor-pointer disabled:opacity-60 ${confirmColor}`}
          >
            {submitting ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </BaseModal>
    </>
  );
}
