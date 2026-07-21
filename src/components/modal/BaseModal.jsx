import { createPortal } from "react-dom";
/**
 * BaseModal
 *
 * A reusable modal shell with backdrop, dialog container, and click-outside-to-close behavior.
 * Supports centered and top-anchored placement for shared dialogs across the app.
 *
 * @prop {boolean}         open        - controls visibility
 * @prop {boolean}         [submitting] - disables backdrop click-to-close while true
 * @prop {() => void}      onClose     - called when backdrop is clicked (and not submitting)
 * @prop {React.ReactNode} children    - modal content (title, body, footer buttons, etc.)
 * @prop {"center"|"top"}  [position]  - dialog placement ("center" by default, "top" for anchored modals)
 * @prop {string}          [maxWidth]  - Tailwind max-width class for the dialog container (default: "max-w-md")
 */
export default function BaseModal({
  open,
  submitting = false,
  onClose,
  children,
  position = "center",
  maxWidth = "max-w-md",
  closeOnBackdrop = true,
  zIndex = 100,
  className,
}) {
  if (!open) return null;

  const positionStyle = {
    top: `fixed inset-x-0 top-6 flex justify-center px-4 pointer-events-none`,
    center: `fixed inset-0 bottom-6 flex items-center justify-center p-4 pointer-events-none`,
  };
  const positionClass = positionStyle[position];

  const modalUI = (
    <>
      <div
        role="presentation"
        className="fixed inset-0 bg-black/50"
        style={{ zIndex }}
        onClick={() => {
          if (!closeOnBackdrop || submitting) return;
          onClose?.();
        }}
      />

      <div className={positionClass} style={{ zIndex: zIndex + 1 }}>
        <div
          role="dialog"
          aria-modal="true"
          className={`bg-white pointer-events-auto rounded-[5px] shadow-2xl w-full ${maxWidth} max-h-[90vh] 
flex flex-col overflow-hidden animate-in fade-in zoom-in-95 border border-gray-200 pt-2 px-6 pb-6 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );

  return createPortal(modalUI, document.body);
}
