import { FormControl, FormLabel } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import dayjs, { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";

import { PaymentAndRefundSummaryFormData } from "../../types/types";
import { RequiredOrNull } from "../../../../../common/types/common";

/**
 * The date time pickers for reports.
 */
export const ReportDateTimePickers = () => {
  const { setValue, watch } = useFormContext<PaymentAndRefundSummaryFormData>();
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
            // defaultValue={dayjs()
            //   .subtract(1, "day")
            //   .set("h", 21)
            //   .set("m", 0)
            //   .set("s", 0)
            //   .set("ms", 0)}
            disableFuture
            format="YYYY/MM/DD hh:mm A"
            minDateTime={toDateTime
              .subtract(30, "day")
              .set("h", 21)
              .set("m", 0)
              .set("s", 0)
              .set("ms", 0)}
            slotProps={{
              digitalClockSectionItem: {
                sx: {
                  width: "76px",
                },
              },
            }}
            onChange={(value: RequiredOrNull<Dayjs>) => {
              setValue("fromDateTime", value as Dayjs);
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
            }}
            format="YYYY/MM/DD hh:mm A"
            value={toDateTime}
            minDate={fromDateTime}
            maxDate={fromDateTime.add(30, "days")}
            views={["year", "month", "day", "hours", "minutes"]}
          />
        </LocalizationProvider>
      </FormControl>
    </>
  );
};
