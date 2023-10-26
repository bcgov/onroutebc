import {
  Box,
  Stack,
  Divider,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { memo, useState } from "react";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { useForm } from "react-hook-form";
import {
  DatePicker,
  DesktopDatePicker,
  DesktopDateTimePicker,
} from "@mui/x-date-pickers";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useUpdatePowerUnitMutation } from "../../../manageVehicles/apiManager/hooks";
import { getPaymentAndRefundSummary } from "../api/reports";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";

enum REPORT_MODE {
  SUMMARY,
  DETAIL,
}

/**
 * React component to render the reports page by an IDIR user.
 */
export const IDIRReportsDashboard = memo(() => {
  const formMethods = useForm({
    reValidateMode: "onBlur",
  });

  const [reportMode, setReportMode] = useState<REPORT_MODE>(
    REPORT_MODE.SUMMARY
  );

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
    <>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText="Reports" />
      </Box>
      <div
        className="tabpanel-container"
        role="tabpanel"
        id={`layout-tabpanel-search-results`}
        aria-labelledby={`layout-tab-search-results`}
      >
        <Stack
          direction="row"
          spacing={5}
          style={{
            paddingTop: "40px",
          }}
          divider={
            <Divider
              flexItem
              orientation="vertical"
              color={BC_COLOURS.bc_border_grey}
            />
          }
        >
          <Stack>
            <span>Radio one</span>
            <span style={{ width: "528px" }}>Radio two</span>
          </Stack>
          {reportMode === REPORT_MODE.SUMMARY && (
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
          )}
        </Stack>
      </div>
    </>
  );
});

IDIRReportsDashboard.displayName = "IDIRReportsDashboard";
