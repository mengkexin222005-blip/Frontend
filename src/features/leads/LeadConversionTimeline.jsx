import { FiUserPlus } from "react-icons/fi";
import { FiSend, FiCheckCircle } from "react-icons/fi";
import { getDisplayName } from "../../utils/name";
import { formatDateTime } from "../../utils/date";

const DirectConversionNode = ({ lead }) => (
  <div className="mb-6">
    <div className="flex items-start gap-4 rounded-md border border-emerald-100 bg-emerald-50/60 px-4 py-3">
      <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
        <FiUserPlus size={16} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-800">
          Directly converted
        </p>
        {(lead.convertedBy || lead.convertedAt) && (
          <div className="mt-2 space-y-0.5">
            {lead.convertedBy && (
              <p className="text-xs text-gray-700 font-medium">
                {getDisplayName(lead.convertedBy, {
                  includeMiddleInitial: true,
                  includeSuffix: true,
                })}
                {lead.convertedBy.role ? (
                  <span className="text-gray-400 font-normal">
                    {" "}
                    · {lead.convertedBy.role}
                  </span>
                ) : null}
              </p>
            )}
            {lead.convertedAt && (
              <p className="text-[10px] text-gray-400">
                {formatDateTime(lead.convertedAt)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

const StandardTimeline = ({ lead }) => {
  const {
    conversionRequested,
    conversionRequestedBy,
    conversionRequestedAt,
    conversionApproved,
    conversionApprovedBy,
    conversionApprovedAt,
    convertedToClient,
    convertedBy,
    convertedAt,
  } = lead;

  const steps = [
    {
      key: "requested",
      label: "Requested",
      icon: FiSend,
      done: Boolean(conversionRequested),
      by: getDisplayName(conversionRequestedBy, {
        includeMiddleInitial: true,
        includeSuffix: true,
      }),
      at: formatDateTime(conversionRequestedAt),
      iconBg: "bg-sky-100",
      dotFill: "bg-sky-500",
      lineColor: "bg-sky-400",
      labelColor: "text-sky-700",
    },
    {
      key: "approved",
      label: "Approved",
      icon: FiCheckCircle,
      done: Boolean(conversionApproved),
      by: getDisplayName(conversionApprovedBy, {
        includeMiddleInitial: true,
        includeSuffix: true,
      }),
      at: formatDateTime(conversionApprovedAt),
      iconBg: "bg-amber-100",
      dotFill: "bg-amber-500",
      lineColor: "bg-amber-400",
      labelColor: "text-amber-700",
    },
    {
      key: "converted",
      label: "Converted",
      icon: FiUserPlus,
      done: Boolean(convertedToClient),
      by: getDisplayName(convertedBy, {
        includeMiddleInitial: true,
        includeSuffix: true,
      }),
      at: formatDateTime(convertedAt),
      iconBg: "bg-emerald-100",
      dotFill: "bg-emerald-500",
      lineColor: "bg-emerald-400",
      labelColor: "text-emerald-700",
    },
  ];

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} className="flex items-start flex-1 min-w-0">
            <div className="flex flex-col items-center min-w-0 shrink-0 w-26">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.done
                    ? `${step.dotFill} border-transparent`
                    : "bg-white border-gray-200"
                }`}
              >
                <Icon
                  size={16}
                  className={step.done ? "text-white" : "text-gray-300"}
                />
              </div>

              <p
                className={`text-xs font-semibold mt-1.5 text-center ${
                  step.done ? step.labelColor : "text-gray-300"
                }`}
              >
                {step.label}
              </p>

              {step.done ? (
                <div className="mt-1 text-center space-y-0.5">
                  {step.by && (
                    <p className="text-xs text-gray-600 font-medium leading-tight truncate max-w-37.5">
                      {step.by}
                    </p>
                  )}
                  {step.at && (
                    <p className="text-[10px] text-gray-400 leading-tight">
                      {step.at}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-gray-300 mt-1 text-center">
                  Pending
                </p>
              )}
            </div>

            {!isLast && (
              <div className="flex-1 mt-4 mx-1.5 h-0.5 rounded-full overflow-hidden bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    step.done ? step.lineColor : "bg-gray-100"
                  }`}
                  style={{ width: step.done ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
export default function LeadConversionTimeline({ lead }) {
  if (!lead) return null;

  const { conversionRequested, conversionApproved, convertedToClient } = lead;

  if (!conversionRequested && !conversionApproved && !convertedToClient) {
    return null;
  }

  const isDirectConversion = convertedToClient && !conversionRequested;

  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 pb-1 border-b border-gray-100">
        Conversion
      </h3>
      {isDirectConversion ? (
        <DirectConversionNode lead={lead} />
      ) : (
        <StandardTimeline lead={lead} />
      )}
    </div>
  );
}
