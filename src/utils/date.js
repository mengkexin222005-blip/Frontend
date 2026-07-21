const DEFAULT_LOCALE = "en-PH";

export const formatDateBase = (
  value,
  { locale = DEFAULT_LOCALE, options = {}, fallback = "—" } = {},
) => {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleString(locale, options);
};

export const formatDate = (value) =>
  formatDateBase(value, {
    options: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  });

export const formatDateTime = (value) =>
  formatDateBase(value, {
    options: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  });

export const formatDateInput = (value) => {
  if (!value) return "";
  const str = String(value);
  return str.includes("T") ? str.split("T")[0] : str;
};

/**
 * Checks whether two dates fall on the same calendar day.
 * Accepts anything that `new Date()` can parse.
 */
export const isSameDay = (a, b) => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

/**
 * Returns true if the given date is today, ignoring time.
 * Pass `status` to skip the check for completed/irrelevant records.
 *
 * @param {string|Date} dueDate
 * @param {string} [status] - skips check when "Completed"
 */
export const isDueToday = (dueDate, status) => {
  if (!dueDate || status === "Completed") return false;
  return isSameDay(dueDate, new Date());
};

/**
 * Returns true if the given date is in the past and not today.
 * Pass `status` to skip the check for completed/irrelevant records.
 *
 * @param {string|Date} dueDate
 * @param {string} [status] - skips check when "Completed"
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "Completed") return false;
  if (isDueToday(dueDate, status)) return false;
  return new Date(dueDate) < new Date();
};

export const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
