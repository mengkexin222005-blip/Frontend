import {
  getAllProvinces,
  getMunicipalitiesByProvince,
} from "@aivangogh/ph-address";

export const PHILIPPINES = "Philippines";
export const NCR_CODE = "1300000000";

export const toOption = (item) => ({
  label: item.name,
  value: item.psgcCode,
  data: item,
});

const buildProvinceOptions = () => {
  const provinces = getAllProvinces().map(toOption);

  const ncrCities = getMunicipalitiesByProvince(NCR_CODE).map((item) => ({
    label: item.name,
    value: item.psgcCode,
    data: item,
    isNCRCity: true,
  }));

  return [
    { label: "Metro Manila (NCR)", options: ncrCities },
    { label: "Provinces", options: provinces },
  ];
};

export const PROVINCE_OPTIONS = buildProvinceOptions();
export const ALL_PROVINCE_OPTIONS = PROVINCE_OPTIONS.flatMap((g) => g.options);
