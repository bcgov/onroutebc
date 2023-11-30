import { Checkbox, FormControlLabel } from "@mui/material";
import { useFormContext } from "react-hook-form";
import {
    PaymentAndRefundDetailFormData,
    PaymentAndRefundSummaryFormData,
    ReportIssuedByType
} from "../../types/types";

/**
 * The props for the IssuedByCheckBox component.
 */
export type IssuedByCheckBoxProps = {
  issuedByOption: ReportIssuedByType;
  label: string;
};

/**
 * The issued by checkbox to be used in reports.
 */
export const IssuedByCheckBox = ({
  issuedByOption,
  label,
}: IssuedByCheckBoxProps) => {
  const { setValue, watch } = useFormContext<PaymentAndRefundSummaryFormData>();
  const issuedBy = watch("issuedBy");
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(
              _event: React.ChangeEvent<HTMLInputElement>,
              checked: boolean,
            ) => {
              if (checked) {
                setValue("issuedBy", [...issuedBy, issuedByOption]);
              } else {
                setValue(
                  "issuedBy",
                  issuedBy.filter((value) => value !== issuedByOption),
                );
              }
            }}
            checked={issuedBy.includes(issuedByOption)}
            sx={{ marginLeft: "0px", paddingLeft: "0px" }}
            name={`issuedBy_${issuedByOption}`}
          />
        }
        label={label}
      />
    </>
  );
};
