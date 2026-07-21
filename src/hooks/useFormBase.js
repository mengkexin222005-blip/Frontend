import { useState } from "react";
import Swal from "sweetalert2";
import {
  getAllProvinces,
  getMunicipalitiesByProvince,
} from "@aivangogh/ph-address";

import { NCR_CODE, PHILIPPINES } from "../constants/phAddress";

// ── Shared empty codes ─────────────────────────────────────────────────────────
export const EMPTY_CODES = {
  provinceCode: "",
  municipalityCode: "",
  isNCRCity: false,
};

// ── Resolve PSGC codes from stored province/city names ─────────────────────────
export const resolveAddressCodes = (province, city) => {
  if (!province) return EMPTY_CODES;

  // NCR city: province name matches an NCR municipality name
  const ncrCities = getMunicipalitiesByProvince(NCR_CODE);
  const matchedNCRCity = ncrCities.find((c) => c.name === province);
  if (matchedNCRCity) {
    return {
      provinceCode: matchedNCRCity.psgcCode,
      municipalityCode: matchedNCRCity.psgcCode,
      isNCRCity: true,
    };
  }

  // Regular province
  const matchedProvince = getAllProvinces().find((p) => p.name === province);
  if (!matchedProvince) return EMPTY_CODES;

  const cities = getMunicipalitiesByProvince(matchedProvince.psgcCode);
  const matchedCity = cities.find((c) => c.name === city);

  return {
    provinceCode: matchedProvince.psgcCode,
    municipalityCode: matchedCity?.psgcCode ?? "",
    isNCRCity: false,
  };
};

/**
 * useFormBase - Shared form state management for all entity forms
 * 
 * Centralized hook used by Lead, Client, User, and Quotation forms
 * Handles common form operations without duplicating code
 * 
 * Manages:
 *   - Form field values
 *   - Address selection and PSGC codes (Philippine Standard Geographic Code)
 *   - Avatar upload and preview
 *   - Form submission state
 * 
 * @param {Object} emptyForm - Template object with default form values
 * @returns {Object} Form state and handlers
 * @returns {Object} .formData - Current form field values
 * @returns {Function} .handleChange - Update single form field
 * @returns {Function} .handleAddressSelect - Update address fields and codes
 * @returns {Function} .handleAvatarChange - Handle avatar file upload
 * @returns {Function} .handleFileRemove - Remove uploaded file
 * @returns {Object} .addressCodes - PSGC codes for address validation
 * @returns {string} .avatar - Avatar File object (for uploading)
 * @returns {string} .preview - Avatar preview URL (for preview image)
 * @returns {Function} .reset - Reset form to empty state
 * 
 * @example
 * const emptyLead = { firstName: '', lastName: '', phone: '', email: '' };
 * const form = useFormBase(emptyLead);
 * 
 * return (
 *   <form onSubmit={(e) => {
 *     e.preventDefault();
 *     api.post('/api/leads', form.formData);
 *   }}>
 *     <input
 *       name="firstName"
 *       value={form.formData.firstName}
 *       onChange={form.handleChange}
 *     />
 *   </form>
 * );
 */
export function useFormBase(emptyForm) {
  const [formData, setFormData] = useState(emptyForm);
  const [addressCodes, setAddressCodes] = useState(EMPTY_CODES);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddressSelect = (formPatch, codePatch = {}) => {
    setFormData((prev) => ({ ...prev, ...formPatch }));
    if (Object.keys(codePatch).length > 0)
      setAddressCodes((prev) => ({ ...prev, ...codePatch }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: "Maximum allowed size is 2MB.",
      });
      e.target.value = "";
      return;
    }
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, removeProfilePicture: false }));
  };

  const clearAvatar = () => {
    setAvatar(null);
    setPreview(null);
    setFormData((prev) => ({ ...prev, removeProfilePicture: true }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setAddressCodes(EMPTY_CODES);
    setPreview(null);
    setAvatar(null);
  };

  /** Build address codes when opening an edit pane for a PH address. */
  const resolveEditCodes = (country, province, city) =>
    country === PHILIPPINES ? resolveAddressCodes(province, city) : EMPTY_CODES;

  /** Set the preview from a stored profilePicture path (or blank). */
  const setPreviewFromPath = (profilePicture) =>
    setPreview(profilePicture ? `http://localhost:5000${profilePicture}` : "");

  return {
    // state
    formData,
    addressCodes,
    avatar,
    preview,
    // setters (for entity hooks to use)
    setFormData,
    setAddressCodes,
    setAvatar,
    setPreview,
    // handlers
    handleChange,
    handleAddressSelect,
    handleAvatarChange,
    clearAvatar,
    resetForm,
    // helpers
    resolveEditCodes,
    setPreviewFromPath,
  };
}
