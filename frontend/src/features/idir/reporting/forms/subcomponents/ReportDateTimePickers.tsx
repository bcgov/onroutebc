import { FormControl, FormLabel } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";
import { PaymentAndRefundDetailFormData } from "../../types/types";

/**
 * The date time pickers for reports.
 */
export const ReportDateTimePickers = () => {
  const { setValue, watch } = useFormContext<PaymentAndRefundDetailFormData>();
  const issuedBy = watch("issuedBy");
  return (
    <>
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
              defaultValue={dayjs()
                .subtract(1, "day")
                .set("h", 21)
                .set("m", 0)
                .set("s", 0)
                .set("ms", 0)}
              format="YYYY/MM/DD hh:mm A"
              slotProps={{
                digitalClockSectionItem: {
                  sx: {
                    width: "76px",
                  },
                },
              }}
              onChange={(value: Dayjs | null) => {
                setValue("fromDateTime", value as Dayjs);
              }}
              disabled={issuedBy.length === 0}
              views={["year", "month", "day", "hours", "minutes"]}
            />
          </LocalizationProvider>
        </FormControl>
      </>
      <>
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
              onChange={(value: Dayjs | null) => {
                setValue("toDateTime", value as Dayjs);
              }}
              format="YYYY/MM/DD hh:mm A"
              defaultValue={dayjs()
                .set("h", 20)
                .set("m", 59)
                .set("s", 59)
                .set("ms", 999)}
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
    </>
  );
};
