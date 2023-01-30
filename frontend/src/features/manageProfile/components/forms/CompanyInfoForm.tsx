import {
  FormControl,
  FormLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import { t } from "i18next";
import { memo } from "react";
import { FormProvider, Controller, useForm } from "react-hook-form";

import "./CompanyInfoForms.scss";

export const CompanyInfoForm = memo(() => {
  const formMethods = useForm({
    defaultValues: {
      unitNumber: "TestUnit",
    },
  });

  /**
   * Custom css overrides for the form fields
   */
  const formFieldStyle = {
    fontWeight: "bold",
    width: "300px",
    marginLeft: "8px",
  };

  const { register, control } = formMethods;

  return (
    <div>
      <FormProvider {...formMethods}>
        <div id="power-unit-form">
          <div>
            <Controller
              key="controller-powerunit-unitNumber"
              name="unitNumber"
              control={control}
              rules={{ required: true }}
              defaultValue={""}
              render={({ fieldState: { invalid } }) => (
                <>
                  <FormControl margin="normal" error={invalid}>
                    <FormLabel
                      id="power-unit-unit-number-label"
                      sx={formFieldStyle}
                    >
                      {t("vehicle.power-unit.unit-number")}
                    </FormLabel>
                    <OutlinedInput
                      aria-labelledby="power-unit-unit-number-label"
                      defaultValue={"Test"}
                      {...register("unitNumber", {
                        required: true,
                      })}
                    />
                    {invalid && (
                      <FormHelperText error>
                        {t("vehicle.power-unit.required", {
                          fieldName: "Unit Number",
                        })}
                      </FormHelperText>
                    )}
                  </FormControl>
                </>
              )}
            />
          </div>
        </div>
      </FormProvider>
    </div>
  );
});

CompanyInfoForm.displayName = "CompanyInfoForm";
