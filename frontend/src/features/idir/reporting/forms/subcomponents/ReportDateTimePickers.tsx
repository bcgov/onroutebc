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
            /**
             * In the scenario where a user wants to select a 30 day window,
             * if the fromDateTime starts at 9:00PM Jan 1, then by default,
             * the max toDateTime could be 8:59 PM Jan 30.
             * However, forcing the user to pick 8:59 PM in the date time picker
             * is an annoyance to them. Instead, we allow them an additional minute so that
             * 9:00 PM is the hard limit. This way, they just have to select the date
             * and can ignore the time if they choose to.
             *
             * The reports API account for a rounding value which allows this buffer.
             *
             * Hence the decision to add 1 minute to 30 days, to make life easier for user.
             */
            maxDateTime={fromDateTime.add(30, "days").add(1, "minute")}
            views={["year", "month", "day", "hours", "minutes"]}
            slotProps={{
              textField: {
                helperText:
                  errors.toDateTime &&
                  "To date time must be after From date time. Maximum date range is 30 days.",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </>
  );
};
