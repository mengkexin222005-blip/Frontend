import { useMemo } from "react";
import Select from "react-select";
import {
  getMunicipalitiesByProvince,
  getBarangaysByMunicipality,
} from "@aivangogh/ph-address";

import { getSelectProps } from "../select/selectConfig";
import { FormLabel, FormInput } from "./FormField";

import { COUNTRY_OPTIONS } from "../../constants/options";
import {
  PHILIPPINES,
  PROVINCE_OPTIONS,
  ALL_PROVINCE_OPTIONS,
  toOption,
} from "../../constants/phAddress";

/**
 * Full PH-aware address field group: Country → Province/NCR → City → Barangay
 * → Street / House Number / Zip Code.
 *
 * Owns its own cascading memos, controlled values, and change handlers so the
 * parent form only needs to forward `formData`, `addressCodes`, and the two
 * callbacks.
 *
 * @param {{
 *   formData: object,
 *   addressCodes: { provinceCode: string, municipalityCode: string, isNCRCity: boolean },
 *   onAddressSelect: (fields: object, codes?: object) => void,
 *   onChange: (e: React.ChangeEvent) => void,
 * }} props
 */
export default function PhAddressFields({
  formData,
  addressCodes,
  onAddressSelect,
  onChange,
}) {
  const isPhilippines = formData.country === PHILIPPINES;

  // ── Cascading options ──────────────────────────────────────────────────────
  const municipalityOptions = useMemo(() => {
    if (!addressCodes.provinceCode || addressCodes.isNCRCity) return [];
    return getMunicipalitiesByProvince(addressCodes.provinceCode).map(toOption);
  }, [addressCodes.provinceCode, addressCodes.isNCRCity]);

  const barangayOptions = useMemo(
    () =>
      addressCodes.municipalityCode
        ? getBarangaysByMunicipality(addressCodes.municipalityCode).map(
            toOption,
          )
        : [],
    [addressCodes.municipalityCode],
  );

  // ── Controlled values ──────────────────────────────────────────────────────
  const currentCountry =
    COUNTRY_OPTIONS.find((o) => o.value === formData.country) || null;
  const currentProvince =
    ALL_PROVINCE_OPTIONS.find((o) => o.value === addressCodes.provinceCode) ||
    null;
  const currentCity =
    municipalityOptions.find(
      (o) => o.value === addressCodes.municipalityCode,
    ) || null;
  const currentBarangay =
    barangayOptions.find((o) => o.label === formData.barangay) || null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCountryChange = (opt) => {
    const newCountry = opt?.value ?? "";
    if (newCountry === formData.country) return;
    onAddressSelect(
      { country: newCountry, province: "", city: "", barangay: "" },
      { provinceCode: "", municipalityCode: "", isNCRCity: false },
    );
  };

  const handleProvinceChange = (opt) => {
    if (!opt) {
      onAddressSelect(
        { province: "", city: "", barangay: "" },
        { provinceCode: "", municipalityCode: "", isNCRCity: false },
      );
      return;
    }
    if (opt.isNCRCity) {
      // NCR city doubles as both province AND city
      onAddressSelect(
        { province: opt.label, city: opt.label, barangay: "" },
        {
          provinceCode: opt.value,
          municipalityCode: opt.value,
          isNCRCity: true,
        },
      );
    } else {
      onAddressSelect(
        { province: opt.label, city: "", barangay: "" },
        { provinceCode: opt.value, municipalityCode: "", isNCRCity: false },
      );
    }
  };

  const handleCityChange = (opt) =>
    onAddressSelect(
      { city: opt?.label ?? "", barangay: "" },
      { municipalityCode: opt?.value ?? "" },
    );

  const handleBarangayChange = (opt) =>
    onAddressSelect({ barangay: opt?.label ?? "" });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Country */}
      <div>
        <FormLabel required>Country</FormLabel>
        <Select
          {...getSelectProps({ isClearable: true })}
          options={COUNTRY_OPTIONS}
          value={currentCountry}
          onChange={handleCountryChange}
          placeholder="Select country"
          required
        />
      </div>

      {isPhilippines ? (
        <>
          {/* Province + City (2-col; city hidden for NCR) */}
          <div
            className={`grid gap-3 ${addressCodes.isNCRCity ? "grid-cols-1" : "grid-cols-2"}`}
          >
            <div>
              <FormLabel required>Province</FormLabel>
              <Select
                {...getSelectProps({ isClearable: true })}
                options={PROVINCE_OPTIONS}
                value={currentProvince}
                onChange={handleProvinceChange}
                placeholder="Select province"
                required
              />
            </div>
            {!addressCodes.isNCRCity && (
              <div>
                <FormLabel required>City / Municipality</FormLabel>
                <Select
                  {...getSelectProps({ isClearable: true })}
                  options={municipalityOptions}
                  value={currentCity}
                  onChange={handleCityChange}
                  placeholder={
                    addressCodes.provinceCode
                      ? "Select city"
                      : "Select province first"
                  }
                  isDisabled={!addressCodes.provinceCode}
                  required
                />
              </div>
            )}
          </div>

          {/* Barangay */}
          <div>
            <FormLabel>Barangay</FormLabel>
            <Select
              {...getSelectProps({ isClearable: true })}
              options={barangayOptions}
              value={currentBarangay}
              onChange={handleBarangayChange}
              placeholder={
                addressCodes.municipalityCode
                  ? "Select barangay"
                  : "Select city first"
              }
              isDisabled={!addressCodes.municipalityCode}
            />
          </div>
        </>
      ) : (
        /* Non-PH: plain text inputs */
        <div className="grid grid-cols-3 gap-3">
          {[
            ["province", "Province", true],
            ["city", "City / Municipality", true],
            ["barangay", "Barangay / District", false],
          ].map(([name, label, req]) => (
            <div key={name}>
              <FormLabel required={req}>{label}</FormLabel>
              <FormInput
                name={name}
                value={formData[name]}
                onChange={onChange}
                required={req}
              />
            </div>
          ))}
        </div>
      )}

      {/* Street / House Number / Zip Code */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <FormLabel>Street</FormLabel>
          <FormInput
            name="street"
            value={formData.street}
            onChange={onChange}
            placeholder="e.g. Rizal St"
          />
        </div>
        <div>
          <FormLabel>House Number</FormLabel>
          <FormInput
            name="houseNumber"
            value={formData.houseNumber}
            onChange={onChange}
            placeholder="e.g. 123"
          />
        </div>
        <div>
          <FormLabel required>Zip Code</FormLabel>
          <FormInput
            name="zipCode"
            value={formData.zipCode}
            onChange={onChange}
            placeholder="e.g. 4400"
            required
          />
        </div>
      </div>
    </>
  );
}
