import BaseModal from "./BaseModal";

/**
 * ConfirmModal
 *
 * A generic, reusable confirmation modal that mirrors the look and feel
 * of LeadActionConfirmModal. Use for any destructive or irreversible action
 * that needs an inline modal confirmation rather than a browser/Swal dialog.
 *
 * @prop {boolean}         open           - controls visibility
 * @prop {boolean}         [submitting]   - disables buttons and shows submittingText while true
 * @prop {string}          title          - modal heading
 * @prop {string}          [description]  - supporting text below the title
 * @prop {string}          [warning]      - small warning line shown above the action buttons
 * @prop {string}          [warningClass] - tailwind text color class for the warning (default: "text-red-600")
 * @prop {React.ReactNode} [children]     - optional content slot (e.g. a UserCard preview)
 * @prop {string}          [confirmText]  - confirm button label (default: "Confirm")
 * @prop {string}          [submittingText] - label while submitting (default: "Please wait…")
 * @prop {string}          [confirmClass] - tailwind classes for the confirm button (default: red)
 * @prop {() => void}      onClose        - called when Cancel is clicked or backdrop is clicked
 * @prop {() => void}      onConfirm      - called when the confirm button is clicked
 */
export default function ConfirmModal({
  open,
  submitting = false,
  title,
  description,
  warning,
  warningClass = "text-red-600",
  children,
  confirmText = "Confirm",
  submittingText = "Please wait…",
  confirmClass = "bg-red-600 hover:bg-red-700",
  onClose,
  onConfirm,
}) {
  return (
    <BaseModal
      open={open}
      submitting={submitting}
      onClose={onClose}
      closeOnBackdrop={false}
      zIndex={120}
    >
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}

      {children && <div className="mt-5">{children}</div>}

      {warning && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className={`text-xs font-medium ${warningClass}`}>{warning}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-colors cursor-pointer disabled:opacity-60 ${confirmClass}`}
        >
          {submitting ? submittingText : confirmText}
        </button>
      </div>
    </BaseModal>
  );
}
