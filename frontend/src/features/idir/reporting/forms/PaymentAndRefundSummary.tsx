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
import { getPaymentAndRefundSummary } from "../../search/api/reports";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";

export const PaymentAndRefundSummary = () => {
  /**
   * Opens the report in a new tab.
   */
  const onClickViewReport = async () => {
    try {
      const { blobObj: blobObjWithoutType } = await getPaymentAndRefundSummary({
        from: "2023-10-25T21:00Z",
        to: "2023-10-25T21:00Z",
        issuedBy: ["SELF", "PPC"],
      });
      openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
    }
  };
  return (
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
          <FormControlLabel
            control={
              <Checkbox
                checked={true}
                sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                name="issuedBy"
              />
            }
            label="Self Issued"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={true}
                sx={{ marginLeft: "0px", paddingLeft: "0px" }}
                name="issuedBy"
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
  );
};
