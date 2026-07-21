// Static option arrays shared across forms/filters

export const toOptions = (arr) =>
  arr.map((v) => ({
    label: v,
    value: v,
  }));

export const COUNTRY_OPTIONS = [
  { label: "Philippines", value: "Philippines" },
  { label: "United States", value: "United States" },
  { label: "Japan", value: "Japan" },
  { label: "Singapore", value: "Singapore" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Australia", value: "Australia" },
  { label: "Canada", value: "Canada" },
  { label: "Germany", value: "Germany" },
  { label: "South Korea", value: "South Korea" },
  { label: "United Arab Emirates", value: "United Arab Emirates" },
  { label: "Other", value: "Other" },
];

// Simple values -> use helper
export const SUFFIX_OPTIONS = toOptions([
  "N/A",
  "Jr.",
  "Sr.",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
]);

export const GENDER_OPTIONS = toOptions(["Male", "Female"]);

export const LEAD_SOURCE_OPTIONS = toOptions([
  "Website",
  "Referral",
  "Social Media",
  "Email Campaign",
  "Walk-in",
  "Other",
]);

export const TASK_PRIORITY_OPTIONS = toOptions(["Low", "Medium", "High"]);

export const TASK_TYPE_OPTIONS = toOptions([
  "Call",
  "Email",
  "Message",
  "Meeting",
  "Reminder",
  "Other",
]);
