import { useFormContext, FieldPath } from "react-hook-form";
import { useCallback, useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { COUNTRIES_THAT_SUPPORT_PROVINCE } from "../../../constants/countries";

import CountriesAndStates from "../../../constants/countries_and_states.json";
import { CompanyProfile } from "../../../features/manageProfile/apiManager/manageProfileAPI";
import { CreatePowerUnit } from "../../../features/manageVehicles/types/managevehicles";
import { DEFAULT_WIDTH } from "../../../themes/bcGovStyles";
import { CustomFormComponent } from "./CustomFormComponents";

/**
 * The props that can be passed to the country and provinces subsection of a form.
 */
interface CountryAndProvinceProps {
  /**
   * Name of the feature that the field belongs to.
   * This name is used for Id's and keys.
   * Example: feature={"profile"}
   */
  feature: string;

  /**
   * The value for the width of the select box
   */
  width?: string;

  /**
   * Name used for the API call. Example: countryField="primaryContact.countryCode"
   */
  countryField: string;
  provinceField: string;
  provinceIdField?: string;

  /**
   * Boolean for react hook form rules. Example-> rules: { required: isCountryRequired }
   * Should default to true
   */
  isCountryRequired?: boolean;
  isProvinceRequired?: boolean;
}

/**
 * The CountryAndProvince component provides form fields for country and province.
 * This implementation uses {@link  COUNTRIES_THAT_SUPPORT_PROVINCE} to display or hide
 * the province field.
 *
 * @returns A react component with the country and province fields.
 */
export const CountryAndProvince = <T extends CompanyProfile | CreatePowerUnit>({
  feature,
  width = DEFAULT_WIDTH,
  countryField,
  isCountryRequired = true,
  provinceField,
  isProvinceRequired = true,
  provinceIdField = "",
}: CountryAndProvinceProps): JSX.Element => {
  const { resetField, watch, setValue, getValues } = useFormContext();

  const [shouldDisplayProvince, setShouldDisplayProvince] =
    useState<boolean>(true);

  const countrySelected = watch(countryField);

  /**
   * Function to handle changes on selecting a country.
   * When the selected country supports provinces, provinces are displayed.
   * Otherwise, the province field is hidden.
   * @param event the select event
   */
  const onChangeCountry = useCallback(function (event: SelectChangeEvent) {
    const country: string = event.target.value as string;
    resetField(provinceField, { defaultValue: "" });
    if (
      !COUNTRIES_THAT_SUPPORT_PROVINCE.find(
        (supportedCountry) => supportedCountry === country
      )
    ) {
      // If country does not support province, as per API spec, set country to province too
      // even though the field is hidden.
      setShouldDisplayProvince(() => false);
      setValue(provinceField, country);
      setValue(provinceIdField, country + "-" + country);
    } else {
      setShouldDisplayProvince(() => true);
    }
  }, []);

  /**
   * Function to handle changes on selecting a province/state.
   * @param event the select event
   */
  const onChangeProvince = useCallback(function (event: SelectChangeEvent) {
    resetField(provinceIdField, { defaultValue: "" });
    const provinceSelected: string = event.target.value;
    setValue(provinceIdField, getValues(countryField) + "-" + provinceSelected);
  }, []);

  /**
   * Returns the list of provinces for the country selected.
   * @param selectedCountry string representing the country
   */
  const getProvinces = useCallback(function (selectedCountry: string) {
    return CountriesAndStates.filter(
      (country) => country.code === selectedCountry
    ).flatMap((country) => country.states);
  }, []);

  const updatedCountryRules = {
    required: {
      value: isCountryRequired,
      message: "Country is required.",
    },
    onChange: onChangeCountry,
  };

  const updatedProvinceRules = {
    required: {
      value: shouldDisplayProvince && isProvinceRequired,
      message: "Province / State is required.",
    },
    onChange: onChangeProvince,
  };

  return (
    <>
      <CustomFormComponent
        type="select"
        feature={feature}
        options={{
          name: countryField as FieldPath<T>,
          rules: updatedCountryRules,
          label: "Country",
          width: width,
        }}
        menuOptions={CountriesAndStates.map((country) => (
          <MenuItem key={`country-${country.name}`} value={country.code}>
            {country.name}
          </MenuItem>
        ))}
      />
      {shouldDisplayProvince && (
        <CustomFormComponent
          type="select"
          feature={feature}
          options={{
            name: provinceField as FieldPath<T>,
            rules: updatedProvinceRules,
            label: "Province / State",
            width: width,
          }}
          menuOptions={getProvinces(countrySelected).map((state) => (
            <MenuItem key={`state-${state?.code}`} value={state?.code}>
              {state?.name}
            </MenuItem>
          ))}
        />
      )}
    </>
  );
};
