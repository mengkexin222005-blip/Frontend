export const SELECT_THEMES = {
  red: {
    primary: "#ef4444",
    primaryLight: "#fee2e2",
    border: "#d1d5db",
    text: "#374151",
    placeholder: "#9ca3af",
  },

  blue: {
    primary: "#0284c7",
    primaryLight: "#e0f2fe",
    border: "#d1d5db",
    text: "#374151",
    placeholder: "#9ca3af",
  },
};

export const baseSelectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: "0.375rem",
  }),
  valueContainer: (base) => ({ ...base }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base }),
  menu: (base) => ({ ...base }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  placeholder: (base, theme) => ({
    ...base,
    color: theme.placeholder,
  }),
};

const createSelectStyles = (theme, variant = "form") => {
  const isFilter = variant === "filter";

  return {
    ...baseSelectStyles,

    container: (base) => ({
      ...base,
      outline: "none !important",
      boxShadow: "none !important",
      "&:focus-within": {
        outline: "none !important",
        boxShadow: "none !important",
      },
    }),
    control: (base, state) => ({
      ...baseSelectStyles.control(base),
      minHeight: isFilter ? "36px" : "38px",
      fontSize: isFilter ? "0.8rem" : "0.875rem",
      borderColor: theme.border,
      boxShadow: "none !important",
      outline: "none !important",
      backgroundColor: "white",
      "&:hover": { borderColor: theme.border },
      "&:active": {
        outline: "none !important",
        boxShadow: "none !important",
      },
      "&:focus": {
        outline: "none !important",
        boxShadow: "none !important",
      },
      "&:focus-visible": {
        outline: "none !important",
        boxShadow: "none !important",
      },
      "&:focus-within": {
        outline: "none !important",
        boxShadow: "none !important",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: isFilter ? "0 8px" : "0 10px",
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: isFilter ? "0 4px" : "0 6px",
    }),

    menu: (base) => ({
      ...base,
      fontSize: isFilter ? "0.8rem" : "0.875rem",
      zIndex: isFilter ? 30 : 9999,
    }),

    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected || isFocused ? theme.primaryLight : "white",
      color: theme.text,
      cursor: "pointer",
      transition: "background-color 120ms ease",
      "&:active": {
        backgroundColor: theme.primaryLight,
      },
    }),

    input: (base) => ({
      ...base,
      outline: "none !important",
      boxShadow: "none !important",
      backgroundColor: "transparent",
      color: theme.text,
      caretColor: theme.text,
      "::selection": {
        backgroundColor: "transparent",
        color: theme.text,
      },
      "::-moz-selection": {
        backgroundColor: "transparent",
        color: theme.text,
      },
      "&:focus": {
        outline: "none !important",
        boxShadow: "none !important",
      },
      "&:focus-visible": {
        outline: "none !important",
        boxShadow: "none !important",
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: theme.placeholder,
    }),
  };
};

export const getSelectProps = ({
  theme = "red",
  variant = "form",
  isSearchable,
  isClearable,
} = {}) => {
  const selectedTheme = SELECT_THEMES[theme];

  return {
    menuPortalTarget: typeof document !== "undefined" ? document.body : null,
    menuPosition: "fixed",
    styles: createSelectStyles(selectedTheme, variant),
    isSearchable: isSearchable ?? variant === "form",
    isClearable: isClearable ?? variant === "filter",
  };
};
