import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ".././VehicleForm.scss";
import { useCallback, useState } from "react";
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
   * Function to handle changes on selecting a country.
   * @param event the select event
   */
  const onChangeCountry = useCallback(function (event: SelectChangeEvent) {
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
  }, []);

  /**
   * Function to handle changes on selecting a province/state.
   * @param event the select event
   */
  const onChangeProvince = useCallback(function (event: SelectChangeEvent) {
    resetField("provinceId", { defaultValue: "" });
    const provinceSelected: string = event.target.value;
    setSelectedProvince(() => event.target.value as string);
    setValue("provinceId", countrySelected + "-" + provinceSelected);
  }, []);

  /**
   * Returns the list of provinces for the country selected.
   * @param selectedCountry string representing the country
   */
  const getProvinces = useCallback(
    function (selectedCountry: string) {
      return CountriesAndStates.filter(
        (country) => country.abbreviation === selectedCountry
      ).flatMap((country) => country.states);
    },
    []
  );

  const { t } = useTranslation();
  return (
    <div>
      <div>
        <FormControl margin="normal" error={Boolean(errors.country)}>
          <FormLabel id="power-unit-country-label" sx={boldTextStyle}>
            {t("vehicle.power-unit.country")}
          </FormLabel>
          <Select
            aria-labelledby="power-unit-country-label"
            defaultValue={country}
            {...register("country", {
              required: false,
              onChange: onChangeCountry,
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
          <FormControl margin="normal" error={shouldDisplayProvince}>
            <FormLabel id="power-unit-province-label" sx={boldTextStyle}>
              {t("vehicle.power-unit.province")}
            </FormLabel>
            <Select
              aria-labelledby="power-unit-province-label"
              defaultValue={province}
              {...register("province", {
                required: shouldDisplayProvince,
                onChange: onChangeProvince,
              })}
              value={selectedProvince}
            >
              {getProvinces(countrySelected).map((state) => (
                <MenuItem
                  key={`state-${state.abbreviation}`}
                  value={state.abbreviation}
                >
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
    </div>
  );
};
