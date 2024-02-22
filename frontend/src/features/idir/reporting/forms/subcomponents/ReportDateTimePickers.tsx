/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, FormLabel } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { useFormContext } from "react-hook-form";

import { PaymentAndRefundSummaryFormData } from "../../types/types";
import { RequiredOrNull } from "../../../../../common/types/common";

dayjs.extend(duration);
const THIRTY_DAYS = 30;

/**
 * The date time pickers for reports.
 */
export const ReportDateTimePickers = () => {
  const { setValue, watch, setError, formState, clearErrors } =
    useFormContext<PaymentAndRefundSummaryFormData>();
  const { errors } = formState;
  const issuedBy = watch("issuedBy");
  const fromDateTime = watch("fromDateTime");
  const toDateTime = watch("toDateTime");
  return (
    <>
      <FormControl
        className="custom-form-control"
        margin="normal"
        sx={{ width: "274px" }}
        disabled={issuedBy.length === 0}
      >
        <FormLabel
          className="custom-form-control__label"
          id="from-date-time-report-label"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          From
        </FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={fromDateTime}
            disableFuture
            format="YYYY/MM/DD hh:mm A"
            slotProps={{
              digitalClockSectionItem: {
                sx: {
                  width: "76px",
                },
              },
            }}
            onChange={(value: RequiredOrNull<Dayjs>) => {
              setValue("fromDateTime", value as Dayjs);
              const diff = dayjs.duration(toDateTime.diff(value)).asDays();
              if (diff <= 0 || Math.round(diff) > THIRTY_DAYS) {
                setError("toDateTime", {
                  message: "To date time must be after From date time.",
                });
              } else {
                clearErrors("toDateTime");
              }
            }}
            disabled={issuedBy.length === 0}
            views={["year", "month", "day", "hours", "minutes"]}
          />
        </LocalizationProvider>
      </FormControl>
      <FormControl
        className="custom-form-control"
        margin="normal"
        sx={{ width: "274px" }}
        disabled={issuedBy.length === 0}
      >
        <FormLabel
          className="custom-form-control__label"
          id="to-date-time-report-label"
          sx={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          To
        </FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            disabled={issuedBy.length === 0}
            onChange={(value: RequiredOrNull<Dayjs>) => {
              setValue("toDateTime", value as Dayjs);
              const diff = dayjs
                .duration((value as Dayjs).diff(fromDateTime))
                .as("days");

              if (Math.round(diff) <= THIRTY_DAYS && diff > 0) {
                clearErrors("toDateTime");
              }
            }}
            format="YYYY/MM/DD hh:mm A"
            value={toDateTime}
            minDate={fromDateTime}
            maxDateTime={fromDateTime.add(30, "days")}
            views={["year", "month", "day", "hours", "minutes"]}
            slotProps={{
              textField: {
                helperText:
                  errors.toDateTime &&
                  "To date time must be after From date time.",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </>
  );
};
