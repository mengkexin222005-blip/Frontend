/**
 * Format currency using Intl (locale-aware)
 * @param {number} value
 * @param {string} currency - ISO code (PHP, USD, EUR, etc.)
 * @param {string} locale
 * @param {"symbol" | "code" | "name"} display
 */
export const formatCurrency = (
  value,
  currency = "PHP",
  locale = "en-PH",
  display = "symbol",
) => {
  if (value === null || value === undefined || isNaN(value)) return "—";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: display,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (err) {
    return `${currency} ${Number(value).toLocaleString()}`;
  }
};

export const formatCurrencyCompact = (value, currency) =>
  formatCurrency(value, currency, "en-PH", "symbol");

export const formatCurrencyFull = (value, currency) =>
  formatCurrency(value, currency, "en-PH", "code");
