import CountriesAndStates from "../constants/countries_and_states.json";

/**
 * Converts CountryCode to Country Name using the countries_and_states.json file
 * @param countryCode
 * @returns Full name of the country
 */
export const formatCountry = (countryCode?: string) => {
  if (!countryCode) return "";

  const countryName = CountriesAndStates.filter(
    (country: any) => country.code === countryCode,
  );
  return countryName[0].name;
};

/**
 * Converts provinceCode to Province Name using the countries_and_states.json file
 * @param countryCode
 * @param provinceCode
 * @returns Full name of the province
 */
export const formatProvince = (countryCode?: string, provinceCode?: string) => {
  if (!countryCode || !provinceCode) return "";

  const countries = CountriesAndStates.filter(
    (country: any) => country.code === countryCode,
  ).flatMap((country: any) => country.states);

  const provinceName = countries.filter(
    (province: any) => province.code === provinceCode,
  );

  if (!provinceName[0]) return "";

  return provinceName[0].name;
};
