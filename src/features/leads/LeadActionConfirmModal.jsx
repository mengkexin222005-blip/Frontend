import ConfirmModal from "../../components/modal/ConfirmModal";
import UserCard from "../../components/view/ViewUserCard";

const ACTION_CONFIG = {
  convert: {
    title: "Convert this lead?",
    description: "This will create a new client record from this lead.",
    warning:
      "⚠ This action cannot be undone. The lead will be permanently marked as converted.",
    confirmText: "Convert",
    submittingText: "Converting…",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700",
    warningClass: "text-amber-600",
  },
  lost: {
    title: "Mark this lead as lost?",
    description: "This will remove the lead from the active pipeline.",
    warning:
      "⚠ This action cannot be undone. The lead will be permanently marked as lost.",
    confirmText: "Mark as Lost",
    submittingText: "Updating…",
    confirmClass: "bg-red-600 hover:bg-red-700",
    warningClass: "text-red-600",
  },
};

export default function LeadActionConfirmModal({
  open,
  lead,
  action = "convert",
  submitting = false,
  canConvert = false,
  onClose,
  onConfirm,
}) {
  const config = ACTION_CONFIG[action];

  const isDirectConvert =
    action === "convert" &&
    !lead?.conversionRequested &&
    !lead?.conversionApproved;

  const title = isDirectConvert ? "Convert this lead directly?" : config.title;
  const description = isDirectConvert
    ? "This will immediately create a client without approval."
    : config.description;

  return (
    <ConfirmModal
      open={open}
      submitting={submitting}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={description}
      warning={config.warning}
      warningClass={config.warningClass}
      confirmText={config.confirmText}
      submittingText={config.submittingText}
      confirmClass={config.confirmClass}
    >
      {lead?.leadAssignee ? (
        <UserCard user={lead.leadAssignee} label="Assigned Agent" />
      ) : (
        <div className="flex flex-col items-start p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-400 italic">No agent assigned</p>

          {action === "convert" && canConvert && (
            <p className="text-xs italic text-gray-500 mt-4 pt-4 border-t border-gray-100">
              If no agent is assigned, you will become the account owner of this
              client.
            </p>
          )}
        </div>
      )}
    </ConfirmModal>
  );
}
