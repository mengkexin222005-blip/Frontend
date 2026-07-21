export const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const calculateQuotationTotals = (
  items,
  taxRate = 0,
  discount = 0,
) => {
  const subtotal = items.reduce(
    (sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitPrice),
    0,
  );
  const discountAmount = Math.min(
    subtotal,
    Math.max(0, toNumber(discount)),
  );
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * (Math.max(0, toNumber(taxRate)) / 100);

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total: taxableAmount + taxAmount,
  };
};

export const createQuotationNumber = () => {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-4);
  return `QUO-${year}-${suffix}`;
};

export const toDateInput = (date) => date.toISOString().slice(0, 10);

export const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};
