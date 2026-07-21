import { useMemo, useState } from "react";
import Select from "react-select";
import { DotLoader } from "react-spinners";
import { Pencil, User, Calendar, FileText, Clock, Plus } from "lucide-react";

import { getSelectProps } from "../../components/select/selectConfig";

import Modal from "../../components/modal/Modal";
import ModalTabs from "../../components/modal/ModalTabs";

import FormDrawer from "../../components/form/FormDrawer";
import FormSection from "../../components/form/FormSection";
import {
  FormLabel,
  FormInput,
  FormTextarea,
} from "../../components/form/FormField";

import BaseBadge from "../../components/badge/BaseBadge";
import UserDisplayName from "../../components/UserDisplayName";

import ActivityTimeline from "../../components/activity/ActivityTimeline";
import TaskTimeline from "../../components/task/TaskTimeline"; 
import QuotationWizard from "./components/QuotationWizard";

import { getDisplayName } from "../../utils/name";
import { formatDate, formatDateTime } from "../../utils/date";
import { formatCurrencyFull } from "../../utils/currency";
// import { getProbabilityTone } from "./utils/quotationPresentation";

const CURRENCIES = [
  { label: "₱ PHP", value: "PHP" },
  { label: "$ USD", value: "USD" },
  { label: "€ EUR", value: "EUR" },
];

const STAGE_COLORS = {
  Draft: { tone: "gray" },
  Sent: { tone: "blue" },
  "Under Review": { tone: "amber" },
  Negotiation: { tone: "purple" },
  Approved: { tone: "green" },
  Rejected: { tone: "red" },
  Expired: { tone: "gray" },
};

const VIEW_TABS = ["Activity", "Tasks"];

export default function QuotationModal({
  stages,
  open,
  mode, // "create" | "view" | "edit"
  formData,
  viewingQuotation,
  activities = [],
  activitiesLoading = false,
  tasks = [],           
  tasksLoading = false, 
  clients = [],
  salesAgents = [],
  currentUser,
  permissions = {},
  loading = false,
  onChange,
  onSelectChange,
  onSwitchToEdit,
  // onSwitchToView,
  onSubmit,
  onDelete,
  onClose,
  onAddTask, 
}) {
  const [activeTab, setActiveTab] = useState("Activity");

  const clientOptions = useMemo(
    () =>
      clients.map((c) => ({
        label: `${getDisplayName(c, { includeSuffix: true })}${c.company ? ` — ${c.company}` : ""}`,
        value: c._id,
      })),
    [clients],
  );

  const agentOptions = useMemo(
    () =>
      salesAgents.map((u) => ({
        label: `${getDisplayName(u, { includeSuffix: true })}`,
        value: u._id,
      })),
    [salesAgents],
  );

  if (!open) return null;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const stageColor =
    STAGE_COLORS[isView ? viewingQuotation?.stage : formData.stage] || "";

  if (isCreate) {
    return (
      <QuotationWizard
        clients={clients}
        currentUser={currentUser}
        formData={formData}
        loading={loading}
        onClose={onClose}
        onSubmit={onSubmit}
        open={open}
        permissions={permissions}
        salesAgents={salesAgents}
        stages={stages}
      />
    );
  }

  const renderView = () => {
    const d = viewingQuotation;
    if (!d) return null;

    const clientName = d.client
      ? getDisplayName(d.client, {
          includeMiddleInitial: true,
          includeSuffix: true,
        })
      : "—";
    const assignedName = d.assignedTo
      ? getDisplayName(d.assignedTo, {
          includeMiddleInitial: true,
          includeSuffix: true,
        })
      : "Unassigned";
    const createdByName = d.createdBy
      ? getDisplayName(d.createdBy, {
          includeMiddleInitial: true,
          includeSuffix: true,
        })
      : "—";

    return (
      <div className="flex flex-row flex-1 min-h-0 h-full">
        <div className="flex flex-col flex-1 min-h-0 pr-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 leading-snug mb-3">
            {d.title}
          </h2>

          {/* Badge + meta row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <BaseBadge tone={stageColor.tone} shape="pill">
              {d.stage}
            </BaseBadge>
            {/* <BaseBadge
              tone={getProbabilityTone(d.probability).tone}
              shape="pill"
            >
              {d.probability}% probability
            </BaseBadge> */}
            <div className="text-sm font-semibold text-gray-700">
              {formatCurrencyFull(d.value, d.currency)}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Notes
            </p>
            {d.notes ? (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {d.notes}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">Add Notes</p>
            )}
          </div>

          {/* Tabs */}
          <ModalTabs
            tabs={VIEW_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab content */}
          <div className="flex-1 min-h-0">
            {activeTab === "Activity" && (
              <div className="flex flex-col gap-2">
                <ActivityTimeline
                  activities={activities}
                  loading={activitiesLoading}
                />
              </div>
            )}

            {activeTab === "Tasks" && (
              <>
                {!tasksLoading && tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">No tasks yet</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Create a task to track work for this quotation
                      </p>
                    </div>
                    {onAddTask && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onAddTask();
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500 
                        text-white rounded-md hover:bg-red-600 transition-colors 
                        cursor-pointer"
                      >
                        <Plus size={14} />
                        Add Task
                      </button>
                    )}
                  </div>
                ) : (
                  <TaskTimeline tasks={tasks} loading={tasksLoading} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 shrink-0" />

        {/* Right sidebar: Details */}
        <div className="w-56 shrink-0 pl-6 overflow-y-auto">
          <p className="text-sm font-semibold text-gray-800 mb-4">Details</p>

          <div className="flex flex-col gap-4">
            {/* Client */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <User size={11} className="text-gray-400" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Client
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">{clientName}</p>
              {d.client?.company && (
                <p className="text-xs text-gray-400">{d.client.company}</p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <User size={11} className="text-gray-400" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Sales Agent
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {d.assignedTo ? (
                  <UserDisplayName user={d.assignedTo}>
                    {assignedName}
                  </UserDisplayName>
                ) : (
                  "Unassigned"
                )}
              </p>
              {d.assignedTo?.role && (
                <p className="text-xs text-gray-400">{d.assignedTo.role}</p>
              )}
            </div>

            {/* Expected Close Date */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Calendar size={11} className="text-gray-400" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Expected Close
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {formatDate(d.expectedCloseDate) || "—"}
              </p>
            </div>

            {/* Created By */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <User size={11} className="text-gray-400" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Created By
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {d.createdBy ? (
                  <UserDisplayName user={d.createdBy}>
                    {createdByName}
                  </UserDisplayName>
                ) : (
                  "—"
                )}
              </p>
            </div>

            {/* Created At */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Clock size={11} className="text-gray-400" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Created At
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {formatDateTime(d.createdAt) || "—"}
              </p>
            </div>

            {/* Updated At */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Clock size={11} className="text-gray-400" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Updated At
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {formatDateTime(d.updatedAt) || "—"}
              </p>
            </div>

            {/* Closed At */}
            {(d.stage === "Won" || d.stage === "Lost") && (
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Calendar size={11} className="text-gray-400" />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Closed At
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {formatDateTime(d.closedAt) || "—"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderViewFooter = () => {
    const d = viewingQuotation;
    if (!d) return null;

    return (
      <div className="flex justify-end items-center gap-2">
        {permissions.canDelete && (
          <button
            type="button"
            onClick={() => onDelete(d._id)}
            className="px-4 py-2 text-sm border border-red-300 text-red-500 rounded-md hover:bg-red-50 transition-colors cursor-pointer ml-auto"
          >
            Delete
          </button>
        )}
        {permissions.canEdit && (
          <button
            type="button"
            onClick={onSwitchToEdit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
          >
            <Pencil size={14} /> Edit Quotation
          </button>
        )}
      </div>
    );
  };

  const renderForm = () => {
    const selectedClient =
      clientOptions.find((o) => o.value === formData.client) || null;
    const selectedAgent =
      agentOptions.find((o) => o.value === formData.assignedTo) || null;

    return (
      <form 
      id="quotation-form"
      onSubmit={onSubmit} 
      className="flex flex-col h-full min-h-0"
      >
        <div className="flex-1 overflow-y-auto min-h-0 space-y-4 px-1">
          {/* Title */}
          <div>
            <FormLabel required>Title</FormLabel>
            <FormInput
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="e.g. Enterprise License Q3"
              required
            />
          </div>

          {/* Client */}
          <div>
            <FormLabel required>Client</FormLabel>
            <Select
              {...getSelectProps({ isClearable: true })}
              placeholder="Select client..."
              options={clientOptions}
              value={selectedClient}
              onChange={(opt) => onSelectChange("client", opt?.value || "")}
            />
          </div>

          {/* Currency + Value + Probability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FormLabel>Currency</FormLabel>
              <Select
                {...getSelectProps({ isSearchable: false })}
                placeholder="Currency"
                options={CURRENCIES}
                value={
                  CURRENCIES.find((c) => c.value === formData.currency) || null
                }
                onChange={(opt) =>
                  onSelectChange("currency", opt?.value || "PHP")
                }
              />
            </div>
            <div>
              <FormLabel required>Value</FormLabel>
              <FormInput
                type="number"
                name="value"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={onChange}
                placeholder="0.00"
                required
              />
            </div>
            {/* <div>
              <FormLabel>Probability</FormLabel>
              <FormInput
                type="number"
                name="probability"
                min="0"
                max="100"
                value={formData.probability}
                onChange={onChange}
              />
            </div> */}
          </div>

          {/* Stage */}
          {isCreate && (
            <div>
              <FormLabel>Stage</FormLabel>
              <Select
                {...getSelectProps({ isSearchable: false })}
                placeholder="Stage"
                options={stages.map((s) => ({ value: s, label: s }))}
                value={
                  stages
                    .map((s) => ({ value: s, label: s }))
                    .find((c) => c.value === formData.stage) || null
                }
                onChange={(opt) => onSelectChange("stage", opt?.value || "")}
              />
            </div>
          )}

          {/* Expected Close Date */}
          <div>
            <FormLabel>Expected Close Date</FormLabel>
            <FormInput
              type="date"
              name="expectedCloseDate"
              value={formData.expectedCloseDate}
              onChange={onChange}
            />
          </div>

          {/* Assigned To */}
          {permissions.canAssign && (
            <div>
              <FormLabel>Assigned To</FormLabel>
              <Select
                {...getSelectProps({ isClearable: true })}
                placeholder="Select agent..."
                options={agentOptions}
                value={selectedAgent}
                onChange={(opt) =>
                  onSelectChange("assignedTo", opt?.value || "")
                }
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <FormLabel>Notes</FormLabel>
            <FormTextarea
              name="notes"
              value={formData.notes}
              onChange={onChange}
              rows={6}
              placeholder="Add any relevant notes..."
            />
          </div>
        </div>
      </form>
    );
  };

  const title = isCreate
    ? "New Quotation"
    : isEdit
      ? "Edit Quotation"
      : viewingQuotation?.title || "Quotation Details";
  
      if (isView) {
        return (
          <Modal
            open={open}
            title={title}
            onClose={onClose}
            maxWidth="max-w-3xl"
            className="min-h-[85vh]"
            footer={renderViewFooter()}
          >
            {renderView()}
          </Modal>
        );
      }

  return (
    <FormDrawer
      open={open}
      title={isCreate ? "Add New Quotation" : "Edit Quotation"}
      formId="quotation-form"
      loading={loading}
      onClose={onClose}
      onCancel={onClose}
      footer={isView ? renderViewFooter() : null}
    >
      {renderForm()}
    </FormDrawer>
);
}