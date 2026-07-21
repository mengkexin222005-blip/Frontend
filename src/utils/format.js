export const formatPhone = (phone) => {
  if (!phone) return "—";
  const cleaned = phone.replace(/\D/g, "");

  if (/^09\d{9}$/.test(cleaned)) {
    return cleaned.replace(/^(09\d{2})(\d{3})(\d{4})$/, "$1 $2 $3");
  }

  if (/^639\d{9}$/.test(cleaned)) {
    return cleaned.replace(/^(63)(9\d{2})(\d{3})(\d{4})$/, "+$1 $2 $3 $4");
  }

  return phone;
};