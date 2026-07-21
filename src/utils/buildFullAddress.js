/**
 * buildFullAddress
 *
 * Joins address fields into a single readable string.
 *
 * @param {object} addr - address object with address fields
 * @returns {string}
 */
export function buildFullAddress(addr) {
  if (!addr) return "—";
  return (
    [
      addr.houseNumber,
      addr.street,
      addr.barangay,
      addr.municipality,
      addr.province,
      addr.zipCode,
      addr.country,
    ]
      .filter(Boolean)
      .join(", ") || "—"
  );
}
