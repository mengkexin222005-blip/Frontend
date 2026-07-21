const clean = (value) => {
  if (!value) return null;

  if (typeof value !== "string") return value;

  const v = value.trim();

  if (!v) return null;

  // normalize unwanted values
  const invalid = ["n/a", "na", "none", "null", "undefined"];

  if (invalid.includes(v.toLowerCase())) return null;

  return v;
};

export const getFullName = (person = {}, options = {}) => {
  const {
    includeMiddleInitial = false,
    includeMiddle = false,
    includeSuffix = true,
    fallback = "",
  } = options;

  if (!person || typeof person !== "object") return fallback;

  const firstName = clean(person.firstName);
  const middleName = clean(person.middleName);
  const lastName = clean(person.lastName);
  const suffix = clean(person.suffixName || person.suffix);

  const parts = [
    firstName,
    includeMiddle ? middleName : null,
    includeMiddleInitial ? toInitials(middleName) : null,
    lastName,
    includeSuffix ? suffix : null,
  ].filter(Boolean);

  return parts.length ? parts.join(" ") : fallback;
};

export const toInitials = (name = "") => {
  const cleaned = clean(name);
  if (!cleaned) return "";

  return cleaned
    .split(/\s+/)
    .map((word) => `${word[0]}.`)
    .join(" ");
};

export const getDisplayName = (person = {}, options = {}) => {
  const fullName = getFullName(person, options);
  return fullName || options.fallback || "Unknown";
};
