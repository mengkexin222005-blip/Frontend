import BaseDraggableCard from "../../components/kanban/BaseDraggableCard";
import BaseBadge from "../../components/badge/BaseBadge";
import UserDisplayName from "../../components/UserDisplayName";

import { getProfileImage } from "../../utils/avatar";
import { getDisplayName } from "../../utils/name";
import { User } from "lucide-react";

export default function LeadCard({
  lead,
  permissions = {},
  index,
  isLast,
  onClick,
}) {
  // Glowing border: show for manager/admin if no conversion process started,
  // show for agent if conversion is approved
  const isReadyToConvert =
    lead.status === "Qualified" &&
    !lead.convertedToClient &&
    (permissions.canApproveConvert
      ? !lead.conversionRequested && !lead.conversionApproved // manager: directly convertible
      : permissions.canRequestConvert && lead.conversionApproved); // agent: approved, ready to convert

  const conversionStatusConfig = {
    requested: {
      label: "Requested",
      tone: "blue",
    },
    pending: {
      label: "Pending",
      tone: "amber",
    },
    approved: {
      label: "Approved",
      tone: "green",
    },
  };

  const getConversionStatusConfig = (lead = {}) => {
    if (lead.convertedToClient) return null;

    if (lead.conversionRequested && !lead.conversionApproved) {
      return permissions.canApproveConvert
        ? conversionStatusConfig.pending
        : conversionStatusConfig.requested;
    }

    if (lead.conversionRequested && lead.conversionApproved) {
      return conversionStatusConfig.approved;
    }

    return null;
  };

  const fullName = getDisplayName(lead, {
    includeMiddleInitial: true,
    includeSuffix: true,
  });

  const assignedName = lead.leadAssignee ? (
    <UserDisplayName user={lead.leadAssignee} showIcon={false}>
      {getDisplayName(lead.leadAssignee, {
        includeMiddleInitial: true,
        includeSuffix: true,
      })}
    </UserDisplayName>
  ) : (
    "Unassigned"
  );

  const conversionStatus = getConversionStatusConfig(lead);

  return (
    <BaseDraggableCard
      id={lead._id}
      index={index}
      isLast={isLast}
      onClick={onClick}
      wrapperClassName={isReadyToConvert ? "ready-to-convert" : ""}
    >
      {/* Name + Status badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={getProfileImage(lead)}
            alt="avatar"
            className="w-7 h-7 rounded-full object-cover border shrink-0"
          />
          <h4 className="text-sm font-medium text-gray-600 leading-tight truncate">
            {fullName}
          </h4>
        </div>

        {conversionStatus && (
          <BaseBadge
            title={`Conversion ${conversionStatus.label}`}
            size="xs"
            shape="pill"
            tone={conversionStatus.tone}
          >
            {conversionStatus.label}
          </BaseBadge>
        )}
      </div>

      {lead.company && (
        <div className="text-xs text-gray-500 mb-1.5 truncate">
          <span className="font-medium text-gray-600">{lead.company}</span>
        </div>
      )}

      {lead.leadSource && (
        <div className="text-xs text-gray-400 mb-1.5">
          Source: {lead.leadSource}
        </div>
      )}

      <div
        className={`flex items-center text-[11px] text-gray-400 ${!lead.leadAssignee && "italic"} mt-2 pt-2 border-t border-gray-100`}
      >
        <span className="flex items-center gap-1 truncate">
          {lead.leadAssignee && (
            <img
              src={getProfileImage(lead.leadAssignee)}
              alt="assignee avatar"
              className="w-5 h-5 rounded-full border"
            />
          )}
          {assignedName}
        </span>
      </div>
    </BaseDraggableCard>
  );
}
