import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ".././VehicleForm.scss";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { COUNTRIES_THAT_SUPPORT_PROVINCE } from "../../../../../constants/countries";

import CountriesAndStates from "../../../../../constants/countries_and_states.json";

/**
 * The props that can be passed to the country and provinces subsection of a form.
 */
interface CountryAndProvinceProps {
  /**
   * The value for the country field.
   * Default value is ''
   */
  country?: string | null;

  /**
   * The value for the province field.
   * Default value is ''
   */
  province?: string | null;
}

/**
 * The CountryAndProvince component provides form fields for country and province.
 * This implementation uses {@link  COUNTRIES_THAT_SUPPORT_PROVINCE} to display or hide
 * the province field.
 *
 * @returns A react component with the country and province fields.
 */
export const CountryAndProvince = ({
  country = "",
  province = "",
}: CountryAndProvinceProps) => {
  const {
    register,
    formState: { errors },
    resetField,
    watch,
    setValue,
  } = useFormContext();

  /**
   * State for displaying selected province
   */
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [shouldDisplayProvince, setShouldDisplayProvince] =
    useState<boolean>(true);

  const countrySelected = watch("country");
  const boldTextStyle = {
    fontWeight: "bold",
  };

  /**
   *
   * @param selectedCountry
   * @returns
   */
  function getProvinceOptions(selectedCountry: string) {
    return CountriesAndStates.filter(
      (country) => country.abbreviation === selectedCountry
    )
      .flatMap((country) => country.states)
      .map((state) => (
        <MenuItem
          key={`state-${state.abbreviation}`}
          value={state.abbreviation}
        >
          {state.name}
        </MenuItem>
      ));
  }

  const { t } = useTranslation();
  return (
    <div>
      <div>
        <FormControl margin="normal">
          <FormLabel id="power-unit-country-label" sx={boldTextStyle}>
            {t("vehicle.power-unit.country")}
          </FormLabel>
          <Select
            aria-labelledby="power-unit-country-label"
            defaultValue={country}
            {...register("country", {
              required: false,
              onChange: (event: SelectChangeEvent) => {
                const country: string = event.target.value as string;
                resetField("province", { defaultValue: "" });
                setSelectedProvince(() => "");
                if (
                  !COUNTRIES_THAT_SUPPORT_PROVINCE.find(
                    (supportedCountry) => supportedCountry === country
                  )
                ) {
                  setShouldDisplayProvince(() => false);
                  setValue("province", country);
                  setValue("provinceId", country + "-" + country);
                } else {
                  setShouldDisplayProvince(() => true);
                }
              },
            })}
          >
            {CountriesAndStates.map((country) => (
              <MenuItem
                key={`country-${country.name}`}
                value={country.abbreviation}
              >
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {shouldDisplayProvince && (
        <div>
          <FormControl margin="normal">
            <FormLabel id="power-unit-province-label" sx={boldTextStyle}>
              {t("vehicle.power-unit.province")}
            </FormLabel>
            <Select
              aria-labelledby="power-unit-province-label"
              defaultValue={province}
              {...register("province", {
                required: false,
              })}
              onChange={(event) => {
                resetField("provinceId", { defaultValue: "" });
                const provinceSelected: string = event.target.value as string;
                setSelectedProvince(() => event.target.value as string);
                setValue(
                  "provinceId",
                  countrySelected + "-" + provinceSelected
                );
              }}
              value={selectedProvince}
            >
              {getProvinceOptions(countrySelected)}
            </Select>
          </FormControl>
        </div>
      )}
    </div>
  );
};
