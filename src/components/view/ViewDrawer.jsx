/**
 * ViewDrawer
 *
 * The slide-in drawer shell used by LeadView, ClientView, UserView.
 * Renders a dimmed backdrop + a right-anchored sliding panel.
 *
 * @prop {boolean}         open      - controls visibility / slide state
 * @prop {() => void}      onClose   - called when backdrop is clicked
 * @prop {React.ReactNode} children  - drawer content (header + body)
 *
 */
export default function ViewDrawer({ open, onClose, children }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-157.5 bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}
