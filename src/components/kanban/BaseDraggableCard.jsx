import { Draggable } from "@hello-pangea/dnd";

const getCardStyle = (style, snapshot) => {
  if (!style) return {};

  if (snapshot.isDropAnimating) {
    return { ...style, transitionDuration: "0.01s" };
  }

  return {
    ...style,
    zIndex: snapshot.isDragging ? 9999 : "auto",
  };
};

export default function BaseDraggableCard({
  id,
  index,
  isLast,
  onClick,
  children,
  wrapperClassName,
}) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getCardStyle(provided.draggableProps.style, snapshot)}
          onClick={() => {
            if (!snapshot.isDragging && onClick) onClick();
          }}
          className={`bg-white border border-gray-200 rounded-md p-3.5 ${
            !isLast ? "mb-2.5" : "mb-1"
          } shadow-sm cursor-grab transition-shadow ${
            snapshot.isDragging
              ? "shadow-lg ring-2 ring-red-200"
              : "hover:shadow-md"
          } ${!snapshot.isDragging && wrapperClassName ? wrapperClassName : ""}`}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
}
