import { useMemo, useState } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Building2,
  Check,
  FileSignature,
  GripVertical,
  Italic,
  Layers3,
  Link,
  List,
  ListOrdered,
  Minus,
  NotepadText,
  PanelTop,
  PenLine,
  Plus,
  Redo2,
  Rows3,
  Table2,
  Trash2,
  Underline,
  Undo2,
  UserRound,
  X,
} from "lucide-react";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";

import {
  CUSTOM_TEMPLATE,
  TEMPLATE_SECTIONS,
} from "../Templates/templateDefaults";

const AVAILABLE_SECTIONS = [
  { id: "company", icon: Layers3 },
  { id: "client", icon: List },
  { id: "text", icon: NotepadText },
  { id: "items", icon: Table2 },
  { id: "summary", icon: Rows3 },
  { id: "terms", icon: PanelTop },
  { id: "notes", icon: NotepadText },
  { id: "signature", icon: FileSignature },
  { id: "divider", icon: Minus },
];

const DEFAULT_SECTIONS = [
  "company",
  "client",
  "text",
  "items",
  "summary",
  "terms",
  "signature",
];

const TOOLBAR_ICONS = [
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Table2,
];

function Stepper() {
  return (
    <div className="grid grid-cols-3 px-9 py-5 border-b border-gray-200 text-xs font-medium">
      <div className="flex items-center gap-3 text-gray-800">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-red-500 text-red-500">
          <Check size={13} />
        </span>
        Choose Template
        <span className="ml-3 h-px flex-1 bg-gray-200" />
      </div>
      <div className="flex items-center gap-3 text-red-500">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
          2
        </span>
        Fill Quotation Details
        <span className="ml-3 h-px flex-1 bg-gray-200" />
      </div>
      <div className="flex items-center justify-center gap-3 text-gray-700">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
          3
        </span>
        Review &amp; Preview
      </div>
    </div>
  );
}

function BuilderSection({ section, onRemove }) {
  const commonClass =
    "rounded-md border border-dashed border-slate-200 bg-white text-[11px] text-slate-500";

  if (section === "divider") {
    return (
      <div className="group relative py-3">
        <div className="border-t border-slate-200" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1 top-0 hidden rounded bg-white p-1 text-red-400 shadow group-hover:block"
        >
          <Trash2 size={12} />
        </button>
      </div>
    );
  }

  if (section === "items") {
    return (
      <div className="group relative overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[44px_1fr_90px_120px_120px] bg-slate-50 text-[10px] font-semibold text-slate-700">
          {["#", "Description", "Qty", "Unit Price", "Amount"].map((label) => (
            <span key={label} className="border-r border-slate-200 px-3 py-3 last:border-0">
              {label}
            </span>
          ))}
        </div>
        <div className="flex h-16 items-center justify-center text-[11px] text-slate-400">
          Click to add item table
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 hidden rounded bg-white p-1 text-red-400 shadow group-hover:block"
        >
          <Trash2 size={12} />
        </button>
      </div>
    );
  }

  const alignRight = section === "summary" || section === "signature";
  const widthClass =
    section === "company" || section === "client"
      ? "w-1/3"
      : alignRight
        ? "ml-auto w-2/5"
        : "w-full";

  return (
    <div className={`group relative ${widthClass} ${commonClass} px-7 py-5`}>
      {section === "company" && "Click to add company info"}
      {section === "client" && "Click to add client info"}
      {section === "text" && "Click to add text"}
      {section === "summary" && "Click to add summary"}
      {section === "terms" && "Click to add terms and conditions"}
      {section === "notes" && "Click to add notes"}
      {section === "signature" && "Click to add signature"}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 hidden rounded bg-white p-1 text-red-400 shadow group-hover:block"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function AvailableSectionButton({ section, onAdd }) {
  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={() => onAdd(section.id)}
      className="flex w-full items-center gap-3 rounded-md border border-slate-200 px-3 py-3 text-left text-[11px] font-medium text-slate-700 transition hover:border-red-300 hover:bg-red-50"
    >
      <Icon size={15} className="text-slate-700" />
      <span className="flex-1">{section.label}</span>
      <Plus size={12} className="text-red-500" />
    </button>
  );
}

export default function TemplateBuilder({ onCancel, onUseTemplate }) {
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  const availableSections = useMemo(
    () =>
      AVAILABLE_SECTIONS.map((section) => ({
        ...section,
        ...TEMPLATE_SECTIONS[section.id],
      })),
    [],
  );

  const addSection = (sectionId) => {
    setSections((current) => [...current, sectionId]);
  };

  const removeSection = (index) => {
    setSections((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination || destination.index === source.index) return;

    setSections((current) => {
      const next = [...current];
      const [moved] = next.splice(source.index, 1);
      next.splice(destination.index, 0, moved);
      return next;
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-9 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Build Your Own Template
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Design your quotation layout by adding and arranging sections.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Close template builder"
        >
          <X size={20} />
        </button>
      </div>

      <Stepper />

      <div className="flex min-h-0 flex-1 gap-3 p-6">
        <aside className="w-52 shrink-0 rounded-md border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800">
            Available Sections
          </h3>
          <p className="mt-1 text-[10px] text-slate-500">
            Click a section to add it to the page
          </p>

          <div className="mt-5 space-y-2">
            {availableSections.map((section) => (
              <AvailableSectionButton
                key={section.id}
                section={section}
                onAdd={addSection}
              />
            ))}
          </div>

          <div className="mt-6 rounded-md bg-red-50 p-3 text-[10px] leading-5 text-slate-600">
            <div className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
              <PenLine size={14} className="text-red-500" />
              Tip
            </div>
            Drag sections on the page to reorder them.
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-slate-200">
          <div className="flex h-14 shrink-0 items-center gap-1 border-b border-slate-200 px-4">
            <select className="mr-3 rounded-md border-slate-200 py-2 pl-3 pr-9 text-xs">
              <option>Normal</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>
            {TOOLBAR_ICONS.map((Icon, index) => (
              <button
                type="button"
                key={`${Icon.displayName || Icon.name}-${index}`}
                className={`rounded p-2 text-slate-700 hover:bg-slate-100 ${
                  index === 3 ? "bg-slate-100" : ""
                }`}
              >
                <Icon size={15} />
              </button>
            ))}
            <span className="flex-1" />
            <button type="button" className="rounded p-2 text-slate-600 hover:bg-slate-100">
              <Undo2 size={15} />
            </button>
            <button type="button" className="rounded p-2 text-slate-400 hover:bg-slate-100">
              <Redo2 size={15} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-3">
            <div className="mx-auto min-h-full max-w-4xl rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Building2 size={20} className="text-red-500" />
                  Company
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    QUOTATION
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Custom quotation layout
                  </p>
                </div>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="quotation-sections">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4"
                    >
                      {sections.map((section, index) => (
                        <Draggable
                          key={`${section}-${index}`}
                          draggableId={`${section}-${index}`}
                          index={index}
                        >
                          {(dragProvided, snapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={`relative rounded-md ${
                                snapshot.isDragging
                                  ? "bg-red-50 shadow-lg"
                                  : "bg-transparent"
                              }`}
                            >
                              <button
                                type="button"
                                {...dragProvided.dragHandleProps}
                                className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded bg-white p-1 text-slate-300 shadow hover:text-slate-600"
                                aria-label="Drag section"
                              >
                                <GripVertical size={13} />
                              </button>
                              <BuilderSection
                                section={section}
                                onRemove={() => removeSection(index)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {sections.length === 0 && (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 text-center text-slate-400">
                  <PanelTop size={28} />
                  <p className="mt-3 text-xs">
                    Add a section to start building your layout.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() =>
              onUseTemplate({
                ...CUSTOM_TEMPLATE,
                name: "Saved Custom Template",
                sections,
              })
            }
            disabled={sections.length === 0}
            className="rounded-md border border-slate-200 px-6 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() =>
              onUseTemplate({
                ...CUSTOM_TEMPLATE,
                sections,
              })
            }
            disabled={sections.length === 0}
            className="flex items-center gap-2 rounded-md bg-red-500 px-6 py-2.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            Use Template
            <UserRound size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
