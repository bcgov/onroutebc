import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import {
  DateTimePicker,
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
import { useState } from "react";
import { now } from "../../../../common/helpers/formatDate";
import dayjs, { Dayjs } from "dayjs";

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

  const [requestObject, setRequestObject] =
    useState<PaymentAndRefundSummaryRequest>({
      issuedBy: ["SELF", "PPC"],
      fromDateTime: "2023-10-25T21:00Z",
      toDateTime: "2023-10-26T20:59Z",
    });

  const [issuedBy, setIssuedBy] = useState<string[]>(["SELF", "PPC"]);
  const [fromDateTime, setFromDateTime] = useState<Dayjs>(
    dayjs().subtract(1, "day").set("h", 21).set("m", 0).set("s", 0).set("ms", 0)
  );
  const [toDateTime, setToDateTime] = useState<Dayjs>(
    dayjs().set("h", 20).set("m", 59).set("s", 59).set("ms", 999)
  );
  const { register, setValue, getValues, control } = formMethods;

  /**
   * Opens the report in a new tab.
   */
  const onClickViewReport = async () => {
    try {
      const requestObj: PaymentAndRefundSummaryRequest = {
        fromDateTime: fromDateTime.toISOString(),
        toDateTime: toDateTime.toISOString(),
        issuedBy,
      };
      console.log("requestObj::", requestObj);
        const { blobObj: blobObjWithoutType } = await getPaymentAndRefundSummary({
          fromDateTime: fromDateTime.toISOString(),
          toDateTime: toDateTime.toISOString(),
          issuedBy,
        });
        openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
    }
  };

  console.log("issuedBy::", issuedBy);
  //   console.log("getValues()::", getValues());
  return (
    <Stack style={{ width: "900px" }} spacing={2}>
      <h2>Payment and Refund Summary</h2>
      <Divider
        flexItem
        orientation="horizontal"
        color={BC_COLOURS.bc_border_grey}
      />

      <span>
        <strong>Issued By</strong>
      </span>
      <Stack direction="row" spacing={5}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={issuedBy.includes("SELF")}
                sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                onChange={(
                  _event: React.ChangeEvent<HTMLInputElement>,
                  checked: boolean
                ) => {
                  if (checked) {
                    setIssuedBy(() => [...issuedBy, "SELF"]);
                  } else {
                    setIssuedBy(() =>
                      issuedBy.filter((value) => value !== "SELF")
                    );
                  }
                  //   const issuedBy = getValues("issuedBy");
                  //   if (checked) {
                  //     issuedBy.push("SELF");
                  //   } else {
                  //     delete issuedBy[issuedBy.indexOf("SELF")];
                  //   }
                  //   setValue("issuedBy", issuedBy);
                }}
              />
            }
            label="Self Issued"
          />
        </FormGroup>
        {/* <Controller
              name="issuedBy"
              control={control}
              defaultValue={["SELF", "PPC"]}
              render={({ field, fieldState: { invalid } }) => {
                return (
                  
                );
              }}
            /> */}

        <FormControlLabel
          control={
            <Checkbox
              checked={issuedBy.includes("PPC")}
              sx={{ marginLeft: "0px", paddingLeft: "0px" }}
              name="issuedBy_PPC"
              onChange={(
                _event: React.ChangeEvent<HTMLInputElement>,
                checked: boolean
              ) => {
                if (checked) {
                  setIssuedBy(() => [...issuedBy, "PPC"]);
                } else {
                  setIssuedBy(() =>
                    issuedBy.filter((value) => value !== "PPC")
                  );
                }
              }}
            />
          }
          label="PPC"
        />
      </Stack>
      <Stack direction="row" spacing={3}>
        <>
          <FormControl
            className="custom-form-control"
            margin="normal"
            sx={{ width: "100%" }}
            disabled={issuedBy.length === 0}
          >
            <FormLabel
              className="custom-form-control__label"
              id={`label`}
              sx={{ fontWeight: "bold", marginBottom: "8px" }}
            >
              From
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DesktopDateTimePicker /> */}
              {/* <DateTimePicker disableFuture openTo="hours"/> */}
              <DateTimePicker
                defaultValue={dayjs()
                  .subtract(1, "day")
                  .set("h", 21)
                  .set("m", 0)
                  .set("s", 0)
                  .set("ms", 0)}
                //   label={<strong>From</strong>}
                onChange={(value: Dayjs | null) => {
                  setFromDateTime(() => value as Dayjs);
                }}
                disabled={issuedBy.length === 0}
                views={["year", "month", "day", "hours", "minutes"]}
                // slotProps={{
                //   textField: {
                //     helperText: "Select a from date time",
                //   },
                // }}
              />
            </LocalizationProvider>
          </FormControl>
        </>
        <>
          <FormControl
            className="custom-form-control"
            margin="normal"
            sx={{ width: "100%" }}
            disabled={issuedBy.length === 0}
          >
            <FormLabel
              className="custom-form-control__label"
              id={`label`}
              sx={{ fontWeight: "bold", marginBottom: "8px" }}
            >
              To
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <DesktopDateTimePicker /> */}
              {/* <DateTimePicker disableFuture openTo="hours"/> */}
              <DateTimePicker
                disabled={issuedBy.length === 0}
                onChange={(value: Dayjs | null) => {
                  setToDateTime(() => value as Dayjs);
                }}
                defaultValue={dayjs()
                  .set("h", 20)
                  .set("m", 59)
                  .set("s", 59)
                  .set("ms", 999)}
                // defaultValue={new Date(fromDateTime)}
                //   label={<strong>To</strong>}
                views={["year", "month", "day", "hours", "minutes"]}
                // slotProps={{
                //   textField: {
                //     helperText: "Select a from date time",
                //   },
                // }}
              />
            </LocalizationProvider>
          </FormControl>
        </>
        {/* <FormControlLabel
            disabled={issuedBy.length === 0}
            control={
              
            }
            label={<strong>From</strong>}
            labelPlacement="top"
          /> */}
        {/* <FormControlLabel
            disabled={issuedBy.length === 0}
            control={
              
            }
            label={<strong>To</strong>}
            labelPlacement="top"
          /> */}
      </Stack>
      <br />
      <Stack direction="row">
        <Button
          disabled={issuedBy.length === 0}
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
  );
};
