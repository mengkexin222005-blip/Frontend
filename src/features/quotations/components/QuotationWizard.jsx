import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Expand,
  FileText,
  Layers3,
  Lightbulb,
  Pencil,
  Plus,
  Printer,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";

import BaseModal from "../../../components/modal/BaseModal";
import intellicrmLogo from "../../../assets/iCRM_Logo_Black.png";
import { buildFullAddress } from "../../../utils/buildFullAddress";
import { formatCurrency } from "../../../utils/currency";
import { getDisplayName } from "../../../utils/name";
import TemplateBuilder from "../Builder/TemplateBuilder";
import {
  QUOTATION_TEMPLATES,
  TEMPLATE_CATEGORIES,
  TEMPLATE_SECTIONS,
} from "../Templates/templateDefaults";
import {
  addDays,
  calculateQuotationTotals,
  createQuotationNumber,
  toDateInput,
  toNumber,
} from "../utils/quotationCalculations";

const FIELD_CLASS =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100";

const CURRENCIES = [
  { value: "PHP", label: "Philippine Peso (PHP)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

const PREVIEW_TABS = [
  { id: "preview", label: "Preview Quotation", icon: FileText },
  { id: "data", label: "Form Data", icon: Layers3 },
  { id: "settings", label: "Settings", icon: Settings },
];

function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function Stepper({ step }) {
  const steps = [
    "Choose Template",
    "Fill Quotation Details",
    "Review & Preview",
  ];

  return (
    <div className="grid grid-cols-3 border-b border-slate-200 px-8 py-5">
      {steps.map((label, index) => {
        const number = index + 1;
        const complete = number < step;
        const active = number === step;

        return (
          <div
            key={label}
            className={`flex items-center text-[11px] font-medium ${
              active ? "text-red-500" : "text-slate-700"
            }`}
          >
            <span
              className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                complete
                  ? "border border-red-500 text-red-500"
                  : active
                    ? "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              {complete ? <Check size={13} /> : number}
            </span>
            <span className="whitespace-nowrap">{label}</span>
            {index < steps.length - 1 && (
              <span className="mx-5 h-px flex-1 bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function WizardHeader({ onClose }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-8 py-5">
      <h2 className="text-xl font-semibold text-slate-900">
        Add New Quotation
      </h2>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Expand quotation wizard"
        >
          <Expand size={18} />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Close quotation wizard"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

function TemplateCard({ template, selected, onSelect }) {
  const Icon = template.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex min-h-52 flex-col rounded-lg border p-4 text-left transition ${
        selected
          ? "border-red-400 bg-red-50/40 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
          <Check size={13} />
        </span>
      )}
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${template.iconClass}`}
      >
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {template.name}
      </h3>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">
        {template.description}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-4 text-[11px] text-slate-500">
        <Layers3 size={13} />
        <span>
          {template.sections.length}{" "}
          {template.sections.length === 1 ? "Section" : "Sections"}
        </span>
      </div>
      <span
        className={`mt-4 flex items-center justify-between rounded-md border px-3 py-2 text-[11px] font-medium ${
          selected
            ? "border-red-200 text-red-500"
            : "border-slate-200 text-slate-600"
        }`}
      >
        Preview
        <ArrowRight size={13} />
      </span>
    </button>
  );
}

function ChooseTemplateStep({
  category,
  error,
  filteredTemplates,
  onBuildCustom,
  onCategoryChange,
  onSearchChange,
  onSelectTemplate,
  quotationTitle,
  search,
  selectedTemplate,
  setQuotationTitle,
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-8 py-5">
      <div>
        <FieldLabel>Quotation Title</FieldLabel>
        <input
          value={quotationTitle}
          onChange={(event) => setQuotationTitle(event.target.value)}
          className={`${FIELD_CLASS} py-3`}
          placeholder="Untitled Quotation Document Title..."
        />
      </div>

      <div className="mt-7 flex items-end justify-between gap-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Choose a Template
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Start with a professionally designed quotation layout.
          </p>
        </div>
        <label className="relative w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className={`${FIELD_CLASS} pl-9`}
            placeholder="Search templates..."
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {TEMPLATE_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            className={`rounded-full border px-5 py-2 text-[11px] font-medium transition ${
              category === item
                ? "border-red-400 bg-red-50 text-red-500"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="mt-5 grid grid-cols-4 gap-4">
        <button
          type="button"
          onClick={onBuildCustom}
          className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-5 text-center transition hover:border-red-300 hover:bg-red-50/30"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <Plus size={27} />
          </span>
          <h3 className="mt-5 text-sm font-semibold text-slate-800">
            Build Your Own Template
          </h3>
          <p className="mt-3 max-w-40 text-[11px] leading-5 text-slate-500">
            Drag and drop sections and create a quotation layout that fits your
            business.
          </p>
        </button>

        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selectedTemplate?.id === template.id}
            onSelect={() => onSelectTemplate(template)}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-16 text-center text-sm text-slate-400">
          No templates match your search.
        </div>
      )}
    </div>
  );
}

function SelectedTemplatePanel({ template, onChangeTemplate }) {
  const Icon = template.icon;

  return (
    <aside className="w-56 shrink-0 rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-medium text-slate-600">Selected Template</p>
      <span
        className={`mt-4 flex h-12 w-12 items-center justify-center rounded-lg ${template.iconClass}`}
      >
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {template.name} Template
      </h3>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">
        {template.description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
        <Layers3 size={13} />
        {template.sections.length} Sections
      </div>
      <button
        type="button"
        onClick={onChangeTemplate}
        className="mt-5 flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
      >
        Change Template
        <Pencil size={13} />
      </button>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-semibold text-slate-800">
          Template Sections
        </p>
        <div className="mt-4 space-y-3">
          {template.sections.map((section) => (
            <div
              key={section}
              className="flex items-center gap-2 text-[10px] text-slate-600"
            >
              <CheckCircle2 size={14} className="text-emerald-500" />
              {TEMPLATE_SECTIONS[section]?.label || section}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 rounded-md bg-red-50 p-3 text-[10px] leading-5 text-slate-600">
        <div className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
          <Lightbulb size={14} className="text-red-500" />
          Tip
        </div>
        All sections are pre-built for you. You can customize their content
        before creating the quotation.
      </div>
    </aside>
  );
}

function SectionHeading({ children }) {
  return (
    <h3 className="border-b border-slate-100 pb-3 text-sm font-semibold text-slate-900">
      {children}
    </h3>
  );
}

function ItemEditor({ currency, items, onAdd, onRemove, onUpdate }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <SectionHeading>Product / Items</SectionHeading>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50"
        >
          <Plus size={13} />
          Add Item
        </button>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[42px_1fr_90px_130px_130px_42px] bg-slate-50 text-[10px] font-semibold text-slate-600">
          {["#", "Description", "Qty", "Unit Price", "Amount", ""].map(
            (label, index) => (
              <span key={`${label}-${index}`} className="px-3 py-2.5">
                {label}
              </span>
            ),
          )}
        </div>
        {items.map((item, index) => {
          const amount = toNumber(item.quantity) * toNumber(item.unitPrice);
          return (
            <div
              key={item.id}
              className="grid grid-cols-[42px_1fr_90px_130px_130px_42px] items-center border-t border-slate-100 text-xs"
            >
              <span className="px-3 text-slate-500">{index + 1}</span>
              <input
                value={item.description}
                onChange={(event) =>
                  onUpdate(item.id, "description", event.target.value)
                }
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
                placeholder="Item description"
              />
              <input
                type="number"
                min="0"
                step="1"
                value={item.quantity}
                onChange={(event) =>
                  onUpdate(item.id, "quantity", event.target.value)
                }
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(event) =>
                  onUpdate(item.id, "unitPrice", event.target.value)
                }
                className="border-0 px-3 py-3 text-xs outline-none focus:ring-0"
                placeholder="0.00"
              />
              <span className="px-3 font-medium text-slate-700">
                {formatCurrency(amount, currency)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="mx-auto rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove item"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailsStep({
  clients,
  details,
  error,
  onAddItem,
  onChangeClient,
  onRemoveItem,
  onUpdate,
  onUpdateItem,
  selectedTemplate,
}) {
  const hasSection = (section) => selectedTemplate.sections.includes(section);

  return (
    <div className="flex min-h-0 flex-1 gap-5 p-6">
      <SelectedTemplatePanel
        template={selectedTemplate}
        onChangeTemplate={() => onUpdate("requestedTemplateChange", true)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 p-6">
        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <section>
            <SectionHeading>Quotation Basic Information</SectionHeading>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Quotation Number</FieldLabel>
                <input
                  value={details.quotationNumber}
                  onChange={(event) =>
                    onUpdate("quotationNumber", event.target.value)
                  }
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <FieldLabel required>Quotation Date</FieldLabel>
                <input
                  type="date"
                  value={details.quotationDate}
                  onChange={(event) =>
                    onUpdate("quotationDate", event.target.value)
                  }
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <FieldLabel>Valid Until</FieldLabel>
                <input
                  type="date"
                  value={details.validUntil}
                  onChange={(event) =>
                    onUpdate("validUntil", event.target.value)
                  }
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <FieldLabel required>Currency</FieldLabel>
                <select
                  value={details.currency}
                  onChange={(event) =>
                    onUpdate("currency", event.target.value)
                  }
                  className={FIELD_CLASS}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <FieldLabel required>Subject / Title</FieldLabel>
                <input
                  value={details.quotationTitle}
                  onChange={(event) =>
                    onUpdate("quotationTitle", event.target.value)
                  }
                  className={FIELD_CLASS}
                  placeholder="e.g. Supply of Office Equipment"
                />
              </div>
            </div>
          </section>

          {hasSection("company") && (
            <section>
              <SectionHeading>Company Information</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Company Name</FieldLabel>
                  <input
                    value={details.companyName}
                    onChange={(event) =>
                      onUpdate("companyName", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input
                    type="email"
                    value={details.companyEmail}
                    onChange={(event) =>
                      onUpdate("companyEmail", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    value={details.companyPhone}
                    onChange={(event) =>
                      onUpdate("companyPhone", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Address</FieldLabel>
                  <input
                    value={details.companyAddress}
                    onChange={(event) =>
                      onUpdate("companyAddress", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("client") && (
            <section>
              <SectionHeading>Client Information</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FieldLabel required>Client Record</FieldLabel>
                  <select
                    value={details.clientId}
                    onChange={(event) => onChangeClient(event.target.value)}
                    className={FIELD_CLASS}
                  >
                    <option value="">Select a client...</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {getDisplayName(client, { includeSuffix: true })}
                        {client.company ? ` — ${client.company}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel required>Client Name</FieldLabel>
                  <input
                    value={details.clientName}
                    onChange={(event) =>
                      onUpdate("clientName", event.target.value)
                    }
                    className={FIELD_CLASS}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <FieldLabel required>Email</FieldLabel>
                  <input
                    type="email"
                    value={details.clientEmail}
                    onChange={(event) =>
                      onUpdate("clientEmail", event.target.value)
                    }
                    className={FIELD_CLASS}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    value={details.clientPhone}
                    onChange={(event) =>
                      onUpdate("clientPhone", event.target.value)
                    }
                    className={FIELD_CLASS}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <FieldLabel>Address</FieldLabel>
                  <input
                    value={details.clientAddress}
                    onChange={(event) =>
                      onUpdate("clientAddress", event.target.value)
                    }
                    className={FIELD_CLASS}
                    placeholder="Enter client address"
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("text") && (
            <section>
              <SectionHeading>Introduction</SectionHeading>
              <textarea
                value={details.introduction}
                onChange={(event) =>
                  onUpdate("introduction", event.target.value)
                }
                rows={3}
                className={`${FIELD_CLASS} mt-4 resize-none`}
                placeholder="Add a short introduction for this quotation..."
              />
            </section>
          )}

          {hasSection("items") && (
            <ItemEditor
              currency={details.currency}
              items={details.items}
              onAdd={onAddItem}
              onRemove={onRemoveItem}
              onUpdate={onUpdateItem}
            />
          )}

          {hasSection("summary") && (
            <section>
              <SectionHeading>Pricing Summary</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Discount Amount</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={details.discount}
                    onChange={(event) =>
                      onUpdate("discount", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Tax Rate (%)</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={details.taxRate}
                    onChange={(event) =>
                      onUpdate("taxRate", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </section>
          )}

          {hasSection("terms") && (
            <section>
              <SectionHeading>Terms &amp; Conditions</SectionHeading>
              <textarea
                value={details.terms}
                onChange={(event) => onUpdate("terms", event.target.value)}
                rows={5}
                className={`${FIELD_CLASS} mt-4 resize-none`}
              />
            </section>
          )}

          {hasSection("notes") && (
            <section>
              <SectionHeading>Notes</SectionHeading>
              <textarea
                value={details.notes}
                onChange={(event) => onUpdate("notes", event.target.value)}
                rows={4}
                className={`${FIELD_CLASS} mt-4 resize-none`}
                placeholder="Add a note for the client..."
              />
            </section>
          )}

          {hasSection("signature") && (
            <section>
              <SectionHeading>Signature</SectionHeading>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Prepared By</FieldLabel>
                  <input
                    value={details.preparedBy}
                    onChange={(event) =>
                      onUpdate("preparedBy", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel>Position</FieldLabel>
                  <input
                    value={details.preparedByRole}
                    onChange={(event) =>
                      onUpdate("preparedByRole", event.target.value)
                    }
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function QuotationDocument({ details, selectedTemplate, totals }) {
  const visibleItems = details.items.filter(
    (item) => item.description || toNumber(item.unitPrice) > 0,
  );

  return (
    <article className="mx-auto min-h-[650px] w-full max-w-2xl bg-white px-8 py-7 text-[9px] text-slate-700 shadow-sm">
      <div className="flex items-start justify-between border-b border-red-100 pb-5">
        <div>
          <img
            src={intellicrmLogo}
            alt="IntelliCRM"
            className="h-10 w-auto object-contain object-left"
          />
          <p className="mt-1 font-medium">{details.companyName}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            QUOTATION
          </h1>
          <p className="mt-2">
            Quotation #: <strong>{details.quotationNumber}</strong>
          </p>
          <p>Date: {details.quotationDate}</p>
          <p>Valid Until: {details.validUntil}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 border-b border-red-100 py-5">
        <div>
          <p className="font-semibold uppercase text-red-500">From:</p>
          <p className="mt-2 font-semibold">{details.companyName}</p>
          <p>{details.companyAddress || "—"}</p>
          <p>Phone: {details.companyPhone || "—"}</p>
          <p>Email: {details.companyEmail || "—"}</p>
        </div>
        <div>
          <p className="font-semibold uppercase text-red-500">To:</p>
          <p className="mt-2 font-semibold">{details.clientName || "—"}</p>
          <p>{details.clientCompany || "—"}</p>
          <p>{details.clientAddress || "—"}</p>
          <p>Phone: {details.clientPhone || "—"}</p>
          <p>Email: {details.clientEmail || "—"}</p>
        </div>
      </div>

      <div className="py-4">
        <p className="font-semibold uppercase text-red-500">
          Subject / Title
        </p>
        <p className="mt-2 font-medium">{details.quotationTitle}</p>
        {selectedTemplate.sections.includes("text") &&
          details.introduction && (
            <p className="mt-3 leading-5 text-slate-500">
              {details.introduction}
            </p>
          )}
      </div>

      {selectedTemplate.sections.includes("items") && (
        <div>
          <div className="grid grid-cols-[36px_1fr_70px_110px_110px] border-y border-red-100 bg-red-50/40 font-semibold uppercase text-red-500">
            {["#", "Description", "Qty", "Unit Price", "Amount"].map((label) => (
              <span key={label} className="px-2 py-2">
                {label}
              </span>
            ))}
          </div>
          {visibleItems.map((item, index) => {
            const amount = toNumber(item.quantity) * toNumber(item.unitPrice);
            return (
              <div
                key={item.id}
                className="grid grid-cols-[36px_1fr_70px_110px_110px] border-b border-slate-100"
              >
                <span className="px-2 py-2">{index + 1}</span>
                <span className="px-2 py-2">{item.description}</span>
                <span className="px-2 py-2">{item.quantity}</span>
                <span className="px-2 py-2">
                  {formatCurrency(item.unitPrice, details.currency)}
                </span>
                <span className="px-2 py-2 text-right font-medium">
                  {formatCurrency(amount, details.currency)}
                </span>
              </div>
            );
          })}

          <div className="ml-auto mt-3 w-64">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal, details.currency)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between py-1">
                <span>Discount</span>
                <span>
                  -{formatCurrency(totals.discountAmount, details.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span>VAT ({details.taxRate || 0}%)</span>
              <span>{formatCurrency(totals.taxAmount, details.currency)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-red-100 bg-red-50/50 px-2 py-2 text-sm font-bold text-red-500">
              <span>Total</span>
              <span>{formatCurrency(totals.total, details.currency)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 grid grid-cols-2 gap-10">
        <div>
          {selectedTemplate.sections.includes("terms") && (
            <>
              <p className="font-semibold uppercase text-red-500">
                Terms &amp; Conditions
              </p>
              <p className="mt-2 whitespace-pre-line leading-5 text-slate-500">
                {details.terms || "—"}
              </p>
            </>
          )}
          {selectedTemplate.sections.includes("notes") && details.notes && (
            <div className="mt-5">
              <p className="font-semibold uppercase text-red-500">Notes</p>
              <p className="mt-2 whitespace-pre-line leading-5 text-slate-500">
                {details.notes}
              </p>
            </div>
          )}
        </div>
        {selectedTemplate.sections.includes("signature") && (
          <div className="self-end text-center">
            <div className="mx-auto mb-2 w-36 border-b border-slate-400" />
            <p className="font-semibold">{details.preparedBy}</p>
            <p className="text-slate-500">{details.preparedByRole}</p>
          </div>
        )}
      </div>
    </article>
  );
}

function QuotationSummary({ details, selectedTemplate, totals }) {
  return (
    <aside className="w-72 shrink-0 rounded-lg border border-slate-200 bg-white">
      <h3 className="border-b border-slate-200 px-4 py-4 text-sm font-semibold text-slate-900">
        Quotation Summary
      </h3>
      <div className="space-y-5 p-4">
        <div className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-500">
            <FileText size={15} />
          </span>
          <div>
            <p className="text-[10px] text-slate-500">Template</p>
            <p className="mt-1 text-xs font-medium text-slate-800">
              {selectedTemplate.name} Template
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500">
              <Layers3 size={15} />
            </span>
            <div>
              <p className="text-[10px] text-slate-500">
                Sections Included ({selectedTemplate.sections.length})
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2.5 pl-1">
            {selectedTemplate.sections.map((section) => (
              <p
                key={section}
                className="flex items-center gap-2 text-[10px] text-slate-600"
              >
                <CheckCircle2 size={13} className="text-emerald-500" />
                {TEMPLATE_SECTIONS[section]?.label || section}
              </p>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-[10px] text-slate-500">Total Amount</p>
          <p className="mt-1 text-lg font-bold text-red-500">
            {formatCurrency(totals.total, details.currency)}
          </p>
        </div>

        <div className="rounded-md bg-red-50 p-4 text-[10px] leading-5 text-slate-600">
          <div className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
            <Lightbulb size={14} className="text-red-500" />
            Tip
          </div>
          Review the quotation preview. You can return to edit details if
          needed.
        </div>
      </div>
    </aside>
  );
}

function FormDataPanel({ details, totals }) {
  const rows = [
    ["Quotation Number", details.quotationNumber],
    ["Subject / Title", details.quotationTitle],
    ["Client", details.clientName],
    ["Company", details.companyName],
    ["Quotation Date", details.quotationDate],
    ["Valid Until", details.validUntil],
    ["Currency", details.currency],
    ["Subtotal", formatCurrency(totals.subtotal, details.currency)],
    ["Tax", formatCurrency(totals.taxAmount, details.currency)],
    ["Total", formatCurrency(totals.total, details.currency)],
  ];

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-white p-6">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-md bg-slate-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-800">
            {value || "—"}
          </p>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel({
  details,
  onUpdate,
  permissions,
  salesAgents,
  stages,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-900">
        Quotation Settings
      </h3>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Pipeline Stage</FieldLabel>
          <select
            value={details.stage}
            onChange={(event) => onUpdate("stage", event.target.value)}
            className={FIELD_CLASS}
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
        {permissions.canAssign && (
          <div>
            <FieldLabel>Assigned To</FieldLabel>
            <select
              value={details.assignedTo}
              onChange={(event) => onUpdate("assignedTo", event.target.value)}
              className={FIELD_CLASS}
            >
              <option value="">Unassigned</option>
              {salesAgents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {getDisplayName(agent, { includeSuffix: true })}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="col-span-2">
          <FieldLabel>Internal Notes</FieldLabel>
          <textarea
            value={details.notes}
            onChange={(event) => onUpdate("notes", event.target.value)}
            rows={5}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Add notes for this quotation..."
          />
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  activeTab,
  details,
  onEditDetails,
  onTabChange,
  onUpdate,
  permissions,
  salesAgents,
  selectedTemplate,
  stages,
  totals,
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 pb-5">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200">
        <div className="flex">
          {PREVIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-[11px] font-medium ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-500"
                    : "border-transparent text-slate-600"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onEditDetails}
          className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil size={13} />
          Edit Details
        </button>
      </div>

      {activeTab === "preview" && (
        <>
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2.5 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-red-50 text-red-500">
                <FileText size={13} />
              </span>
              <span>
                Template:{" "}
                <strong>{selectedTemplate.name} Template</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-slate-500">
                View
                <button
                  type="button"
                  className="flex items-center gap-8 rounded-md border border-slate-200 px-3 py-2 text-slate-700"
                >
                  Desktop
                  <ChevronDown size={13} />
                </button>
              </label>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <Download size={13} />
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                <Printer size={13} />
                Print
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 gap-5 overflow-auto bg-slate-50 p-4">
            <div className="min-w-0 flex-1">
              <QuotationDocument
                details={details}
                selectedTemplate={selectedTemplate}
                totals={totals}
              />
            </div>
            <QuotationSummary
              details={details}
              selectedTemplate={selectedTemplate}
              totals={totals}
            />
          </div>
        </>
      )}

      {activeTab === "data" && (
        <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-5">
          <FormDataPanel details={details} totals={totals} />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-5">
          <SettingsPanel
            details={details}
            onUpdate={onUpdate}
            permissions={permissions}
            salesAgents={salesAgents}
            stages={stages}
          />
        </div>
      )}
    </div>
  );
}

function WizardFooter({
  loading,
  onBack,
  onCancel,
  onContinue,
  onSaveDraft,
  onSubmit,
  selectedTemplate,
  step,
}) {
  const TemplateIcon = selectedTemplate?.icon;

  return (
    <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
      {step === 1 ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          {selectedTemplate && (
            <div className="ml-4 flex items-center gap-3 border-l border-slate-200 pl-5">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-md ${selectedTemplate.iconClass}`}
              >
                {TemplateIcon && <TemplateIcon size={18} />}
              </span>
              <div>
                <p className="text-[10px] text-slate-500">Selected Template</p>
                <p className="text-xs font-medium text-red-500">
                  {selectedTemplate.name} Template
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      )}

      <div className="flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex items-center gap-2 rounded-md border border-slate-200 px-5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <ArrowLeft size={14} />
            {step === 3 ? "Back: Fill Details" : "Back"}
          </button>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={loading}
            className="rounded-md border border-slate-200 px-6 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Save Draft
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={onContinue}
            disabled={loading}
            className="flex items-center gap-4 rounded-md bg-red-500 px-6 py-2.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {step === 1 ? "Continue" : "Next: Review & Preview"}
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center gap-3 rounded-md bg-red-500 px-7 py-2.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Quotation"}
            <CheckCircle2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

const getClientDetails = (client) => {
  if (!client) {
    return {
      clientName: "",
      clientCompany: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
    };
  }

  const address = buildFullAddress(client.address);
  return {
    clientName: getDisplayName(client, {
      includeMiddleInitial: true,
      includeSuffix: true,
    }),
    clientCompany: client.company || "",
    clientEmail: client.email || "",
    clientPhone: client.phone || "",
    clientAddress: address === "—" ? "" : address,
  };
};

const createInitialDetails = (formData, clients, currentUser) => {
  const now = new Date();
  const selectedClient = clients.find(
    (client) => String(client._id) === String(formData.client || ""),
  );
  const companyAddress = buildFullAddress(currentUser?.address);

  return {
    quotationNumber: createQuotationNumber(),
    quotationDate: toDateInput(now),
    validUntil:
      formData.expectedCloseDate || toDateInput(addDays(now, 30)),
    quotationTitle: formData.title || "",
    currency: formData.currency || "PHP",
    companyName:
      currentUser?.company || "IntelliCRM Technology Solutions Inc.",
    companyEmail: currentUser?.email || "info@intellicrm.com",
    companyPhone: currentUser?.phone || "",
    companyAddress: companyAddress === "—" ? "" : companyAddress,
    clientId: formData.client || "",
    ...getClientDetails(selectedClient),
    introduction:
      "Thank you for the opportunity to provide this quotation. The following products and services are proposed for your consideration.",
    items: [
      {
        id: "item-1",
        description: "",
        quantity: "1",
        unitPrice: "",
      },
    ],
    discount: "0",
    taxRate: "12",
    terms:
      "This quotation is valid until the date indicated above.\nPayment terms: 50% down payment, 50% upon delivery.\nDelivery: 7-10 business days upon receipt of payment.",
    notes: formData.notes || "",
    preparedBy: getDisplayName(currentUser, {
      includeMiddleInitial: true,
      includeSuffix: true,
      fallback: "",
    }),
    preparedByRole: currentUser?.role || "",
    stage: formData.stage || "Draft",
    assignedTo: formData.assignedTo || "",
  };
};

export default function QuotationWizard({
  clients = [],
  currentUser,
  formData,
  loading,
  onClose,
  onSubmit,
  open,
  permissions = {},
  salesAgents = [],
  stages = [],
}) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(
    QUOTATION_TEMPLATES.find((template) => template.id === "product"),
  );
  const [quotationTitle, setQuotationTitle] = useState(formData.title || "");
  const [details, setDetails] = useState(() =>
    createInitialDetails(formData, clients, currentUser),
  );
  const [activeTab, setActiveTab] = useState("preview");
  const [showBuilder, setShowBuilder] = useState(false);
  const [error, setError] = useState("");

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return QUOTATION_TEMPLATES.filter((template) => {
      const matchesCategory =
        category === "All" || template.category === category;
      const matchesSearch =
        !query ||
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const totals = useMemo(
    () =>
      calculateQuotationTotals(
        details.items,
        details.taxRate,
        details.discount,
      ),
    [details.discount, details.items, details.taxRate],
  );

  if (!open) return null;

  const updateDetails = (name, value) => {
    if (name === "requestedTemplateChange") {
      setStep(1);
      return;
    }
    setDetails((current) => ({ ...current, [name]: value }));
  };

  const changeClient = (clientId) => {
    const selectedClient = clients.find(
      (client) => String(client._id) === String(clientId),
    );
    setDetails((current) => ({
      ...current,
      clientId,
      ...getClientDetails(selectedClient),
    }));
  };

  const addItem = () => {
    setDetails((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: `item-${Date.now()}`,
          description: "",
          quantity: "1",
          unitPrice: "",
        },
      ],
    }));
  };

  const updateItem = (itemId, name, value) => {
    setDetails((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId ? { ...item, [name]: value } : item,
      ),
    }));
  };

  const removeItem = (itemId) => {
    setDetails((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? current.items
          : current.items.filter((item) => item.id !== itemId),
    }));
  };

  const validateTemplate = () => {
    if (!quotationTitle.trim()) {
      setError("Enter a quotation title before continuing.");
      return false;
    }
    if (!selectedTemplate) {
      setError("Select a quotation template before continuing.");
      return false;
    }
    return true;
  };

  const validateDetails = () => {
    if (!details.quotationTitle.trim() || !details.companyName.trim()) {
      setError("Complete the required quotation and company fields.");
      return false;
    }
    if (!details.clientId) {
      setError("Select a client record before continuing.");
      return false;
    }
    if (
      selectedTemplate.sections.includes("items") &&
      (totals.total <= 0 ||
        !details.items.some((item) => item.description.trim()))
    ) {
      setError("Add at least one priced item with a description.");
      return false;
    }
    return true;
  };

  const continueToNextStep = () => {
    setError("");
    if (step === 1) {
      if (!validateTemplate()) return;
      setDetails((current) => ({
        ...current,
        quotationTitle: quotationTitle.trim(),
      }));
      setStep(2);
      return;
    }
    if (step === 2 && validateDetails()) {
      setStep(3);
    }
  };

  const createPayload = (stage) => ({
    ...formData,
    title: details.quotationTitle.trim() || quotationTitle.trim(),
    client: details.clientId,
    value: totals.total,
    currency: details.currency,
    stage: stage || details.stage || "Draft",
    expectedCloseDate: details.validUntil || null,
    assignedTo: details.assignedTo,
    notes: [details.notes, details.terms].filter(Boolean).join("\n\n"),
  });

  const submitQuotation = async (stage) => {
    setError("");
    if (!validateTemplate() || !validateDetails()) {
      if (step !== 2) setStep(2);
      return;
    }
    await onSubmit(
      { preventDefault: () => undefined },
      createPayload(stage),
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      submitting={loading}
      closeOnBackdrop={false}
      maxWidth="max-w-[1180px]"
      className="!h-[94vh] !max-h-[94vh] !rounded-lg !p-0"
    >
      {showBuilder ? (
        <TemplateBuilder
          onCancel={() => setShowBuilder(false)}
          onUseTemplate={(template) => {
            setSelectedTemplate(template);
            setShowBuilder(false);
            setStep(2);
            setDetails((current) => ({
              ...current,
              quotationTitle:
                quotationTitle.trim() || current.quotationTitle,
            }));
          }}
        />
      ) : (
        <div className="flex h-full min-h-0 flex-col">
          <WizardHeader onClose={onClose} />
          <Stepper step={step} />

          {step === 1 && (
            <ChooseTemplateStep
              category={category}
              error={error}
              filteredTemplates={filteredTemplates}
              onBuildCustom={() => setShowBuilder(true)}
              onCategoryChange={setCategory}
              onSearchChange={setSearch}
              onSelectTemplate={setSelectedTemplate}
              quotationTitle={quotationTitle}
              search={search}
              selectedTemplate={selectedTemplate}
              setQuotationTitle={setQuotationTitle}
            />
          )}

          {step === 2 && (
            <DetailsStep
              clients={clients}
              details={details}
              error={error}
              onAddItem={addItem}
              onChangeClient={changeClient}
              onRemoveItem={removeItem}
              onUpdate={updateDetails}
              onUpdateItem={updateItem}
              selectedTemplate={selectedTemplate}
            />
          )}

          {step === 3 && (
            <ReviewStep
              activeTab={activeTab}
              details={details}
              onEditDetails={() => setStep(2)}
              onTabChange={setActiveTab}
              onUpdate={updateDetails}
              permissions={permissions}
              salesAgents={salesAgents}
              selectedTemplate={selectedTemplate}
              stages={stages}
              totals={totals}
            />
          )}

          <WizardFooter
            loading={loading}
            onBack={() => {
              setError("");
              setStep((current) => Math.max(1, current - 1));
            }}
            onCancel={onClose}
            onContinue={continueToNextStep}
            onSaveDraft={() => submitQuotation("Draft")}
            onSubmit={() => submitQuotation()}
            selectedTemplate={selectedTemplate}
            step={step}
          />
        </div>
      )}
    </BaseModal>
  );
}
