import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import {
  DesktopDateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PaymentAndRefundSummaryRequest,
  getPaymentAndRefundSummary,
} from "../../search/api/reports";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { CustomCheckbox } from "../../../../common/components/form/subFormComponents/CustomCheckbox";

const sample = {
  issuedBy: ["SELF"],
  fromDateTime: "2023-10-11T23:26:51.170Z",
  toDateTime: "2023-10-27T23:26:51.170Z",
};

export const PaymentAndRefundSummary = () => {
  const formMethods = useForm<PaymentAndRefundSummaryRequest>({
    defaultValues: {
      issuedBy: ["SELF", "PPC"],
      fromDateTime: "2023-10-25T21:00Z",
      toDateTime: "2023-10-26T20:59Z",
    },
    reValidateMode: "onBlur",
  });

  const { register, setValue, getValues, control } = formMethods;

  /**
   * Opens the report in a new tab.
   */
  const onClickViewReport = async () => {
    try {
      const { blobObj: blobObjWithoutType } = await getPaymentAndRefundSummary({
        fromDateTime: "2023-10-25T21:00Z",
        toDateTime: "2023-10-25T21:00Z",
        issuedBy: [],
      });
      openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
    }
  };

  console.log("getValues()::", getValues());
  return (
    <FormProvider {...formMethods}>
      <Stack style={{ width: "900px" }} spacing={2}>
        <h2>Payment and Refund Summary</h2>
        <Divider
          flexItem
          orientation="horizontal"
          color={BC_COLOURS.bc_border_grey}
        />
        <FormGroup>
          <br />
          <span>
            <strong>Issued By</strong>
          </span>
          <Stack direction="row" spacing={5}>
            <Controller
              name="issuedBy"
              control={control}
              defaultValue={["SELF", "PPC"]}
              render={({ field, fieldState: { invalid } }) => {
                return (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getValues("issuedBy").includes("SELF")}
                          sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                          //   onChange={(
                          //     _event: React.ChangeEvent<HTMLInputElement>,
                          //     checked: boolean
                          //   ) => {
                          //     const issuedBy = getValues("issuedBy");
                          //     if (checked) {
                          //       issuedBy.push("SELF");
                          //     } else {
                          //       delete issuedBy[issuedBy.indexOf("SELF")];
                          //     }
                          //     setValue("issuedBy", issuedBy);
                          //   }}
                        />
                      }
                      label="Self Issued"
                    />
                  </FormGroup>
                );
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={getValues("issuedBy").includes("PPC")}
                  sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                  name="issuedBy_PPC"
                  onChange={(
                    _event: React.ChangeEvent<HTMLInputElement>,
                    checked: boolean
                  ) => {
                    let issuedBy = getValues("issuedBy");
                    console.log("Onchange::", checked);
                    console.log("Onchange::", issuedBy);
                    if (checked) {
                      issuedBy.push("PPC");
                    } else {
                      issuedBy = issuedBy.filter((value) => value !== "PPC");
                    }
                    setValue("issuedBy", issuedBy);
                  }}
                />
              }
              label="PPC"
            />
          </Stack>
          <Stack direction="row" spacing="2">
            <FormControlLabel
              control={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDateTimePicker />
                  {/* <DateTimePicker disableFuture openTo="hours"/> */}
                  {/* <DateTimePicker
        label={<strong>From</strong>}
        views={['year', 'month', 'day', 'hours', 'minutes']}
        // slotProps={{
        //   textField: {
        //     helperText: "Select a from date time",
        //   },
        // }}
      /> */}
                </LocalizationProvider>
              }
              label={<strong>From</strong>}
              labelPlacement="top"
            />
            <FormControlLabel
              control={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDateTimePicker />
                  {/* <DateTimePicker disableFuture openTo="hours"/> */}
                  {/* <DateTimePicker
        label={<strong>From</strong>}
        views={['year', 'month', 'day', 'hours', 'minutes']}
        // slotProps={{
        //   textField: {
        //     helperText: "Select a from date time",
        //   },
        // }}
      /> */}
                </LocalizationProvider>
              }
              label={<strong>To</strong>}
              labelPlacement="top"
            />
          </Stack>
        </FormGroup>
        <Stack direction="row">
          <Button
            key="view-report-button"
            aria-label="View Report"
            variant="contained"
            color="primary"
            onClick={onClickViewReport}
          >
            View Report
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};
