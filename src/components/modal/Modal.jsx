import { X } from "lucide-react";
import BaseModal from "./BaseModal";

export default function Modal({
  open,
  title,
  onClose,
  maxWidth = "max-w-xl",
  children,
  footer,
  className,
}) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      className={className}
    >
      {/* Header */}
      <div className="shrink-0 flex justify-end pt-0 pb-0 ">
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col p-1">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="shrink-0 pt-3 mt-2 border-t border-gray-100">
          {footer}
        </div>
      )}
    </BaseModal>
  );
}