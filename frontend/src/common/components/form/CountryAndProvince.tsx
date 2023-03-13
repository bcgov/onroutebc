import { useFormContext, Controller, RegisterOptions } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormHelperText from "@mui/material/FormHelperText";
import { useCallback, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { COUNTRIES_THAT_SUPPORT_PROVINCE } from "../../../constants/countries";

import CountriesAndStates from "../../../constants/countries_and_states.json";
import { Box } from "@mui/material";
import { BC_COLOURS } from "../../../themes/bcGovStyles";

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

  /**
   * The value for the width of the select box
   */
  width?: string | null;

  /**
   * React Hook Form rules. Example: rules={{ required: false }}
   */
  rules?: RegisterOptions;

  /**
   * Name used for the API call. Example: countryField={"primaryContact.countryCode"}
   */
  countryField?: string;
  provinceField?: string;

  /**
   * Name of the feature that the field belongs to.
   * This name is used for Id's and keys.
   * Example: feature={"profile"}
   */
  feature?: string;
}

/**
 * The CountryAndProvince component provides form fields for country and province.
 * This implementation uses {@link  COUNTRIES_THAT_SUPPORT_PROVINCE} to display or hide
 * the province field.
 *
 * @returns A react component with the country and province fields.
 */
export const CountryAndProvince = ({
  country,
  province,
  width = "",
  rules = { required: true },
  countryField = "country",
  provinceField = "province",
  feature = "power-unit",
}: CountryAndProvinceProps) => {
  const { register, resetField, watch, setValue, getValues, control } =
    useFormContext();

  /**
   * State for displaying selected province
   */
  const [selectedProvince, setSelectedProvince] = useState<string>(
    province || ""
  );
  const [shouldDisplayProvince, setShouldDisplayProvince] =
    useState<boolean>(true);

  const countrySelected = watch(countryField);
  /**
   * Custom css overrides for the form fields
   */
  const formFieldStyle = {
    fontWeight: "bold",
  };

  /**
   * Function to handle changes on selecting a country.
   * When the selected country supports provinces, provinces are displayed.
   * Otherwise, the province field is hidden.
   * @param event the select event
   */
  const onChangeCountry = useCallback(function (event: SelectChangeEvent) {
    const country: string = event.target.value as string;
    resetField(provinceField, { defaultValue: "" });
    setSelectedProvince(() => "");
    if (
      !COUNTRIES_THAT_SUPPORT_PROVINCE.find(
        (supportedCountry) => supportedCountry === country
      )
    ) {
      // If country does not support province, as per API spec, set country to province too
      // even though the field is hidden.
      setShouldDisplayProvince(() => false);
      setValue(provinceField, country);
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

    setValue("provinceId", getValues(countryField) + "-" + provinceSelected);
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

  const { t } = useTranslation();
  return (
    <Box sx={{ width: width }}>
      <div>
        <Controller
          key={`controller-${feature}-country`}
          name={countryField}
          control={control}
          rules={rules}
          defaultValue={country || ""}
          render={({ fieldState: { invalid } }) => (
            <>
              <FormControl
                margin="normal"
                error={invalid}
                sx={{ width: "100%" }}
              >
                <FormLabel id={`${feature}-country-label`} sx={formFieldStyle}>
                  {t("vehicle.power-unit.country")}
                  {!rules.required && (
                    <span style={{ fontWeight: "normal" }}> (optional)</span>
                  )}
                </FormLabel>
                <Select
                  aria-labelledby={`${feature}-country-label`}
                  inputProps={{
                    "aria-label": "country",
                  }}
                  defaultValue={country || ""}
                  {...register(countryField, {
                    required: rules.required,
                    onChange: onChangeCountry,
                  })}
                  sx={{
                    "&&.Mui-focused fieldset": {
                      border: `2px solid ${BC_COLOURS.focus_blue}`,
                    },
                  }}
                >
                  {CountriesAndStates.map((country) => (
                    <MenuItem
                      key={`country-${country.name}`}
                      value={country.code}
                    >
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {invalid && (
                  <FormHelperText error>
                    {t("vehicle.power-unit.required", { fieldName: "Country" })}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          )}
        />
      </div>
      {shouldDisplayProvince && (
        <div>
          <Controller
            key={`controller-${feature}-province`}
            name={provinceField}
            rules={{ required: shouldDisplayProvince && rules.required }}
            defaultValue={province || ""}
            render={({ fieldState: { invalid } }) => (
              <>
                <FormControl
                  margin="normal"
                  error={invalid}
                  sx={{ width: "100%" }}
                >
                  <FormLabel
                    id={`${feature}-province-label`}
                    sx={formFieldStyle}
                  >
                    {t("vehicle.power-unit.province")}
                    {!rules.required && (
                      <span style={{ fontWeight: "normal" }}> (optional)</span>
                    )}
                  </FormLabel>
                  <Select
                    aria-labelledby={`${feature}-province-label`}
                    inputProps={{
                      "aria-label": provinceField,
                    }}
                    defaultValue={province || ""}
                    {...register(provinceField, {
                      required: shouldDisplayProvince && rules.required,
                      onChange: onChangeProvince,
                    })}
                    value={selectedProvince}
                    sx={{
                      "&&.Mui-focused fieldset": {
                        border: `2px solid ${BC_COLOURS.focus_blue}`,
                      },
                    }}
                  >
                    {getProvinces(countrySelected).map((state) => (
                      <MenuItem
                        key={`state-${state?.code}`}
                        value={state?.code}
                      >
                        {state?.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {invalid && (
                    <FormHelperText error>
                      {t("vehicle.power-unit.required", {
                        fieldName: "Province / State",
                        interpolation: {
                          escapeValue: false,
                        },
                      })}
                    </FormHelperText>
                  )}
                </FormControl>
              </>
            )}
          />
        </div>
      )}
    </Box>
  );
};
