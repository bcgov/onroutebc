import {
  Box,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  Stack
} from "@mui/material";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { PaymentAndRefundDetail } from "../../reporting/forms/PaymentAndRefundDetail";
import { PaymentAndRefundSummary } from "../../reporting/forms/PaymentAndRefundSummary";

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
              sx={{ height: '1121px'}}
            />
          }
        >
          <Stack sx={{ width: "528px" }} spacing={3}>
            <Paper
              sx={{
                height: "75px",
                background:
                  reportMode === REPORT_MODE.SUMMARY
                    ? BC_COLOURS.bc_messages_blue_background
                    : null,
                border: "1px solid #313132",
                cursor: "pointer",
              }}
              onClick={() => {
                setReportMode(() => REPORT_MODE.SUMMARY);
              }}
            >
              <FormControlLabel
                control={<Radio checked={reportMode === REPORT_MODE.SUMMARY} />}
                label={<strong>Payment and Refund Summary</strong>}
              />
            </Paper>
            <Paper
              sx={{
                height: "75px",
                background:
                  reportMode === REPORT_MODE.DETAIL
                    ? BC_COLOURS.bc_messages_blue_background
                    : null,
                border:
                  reportMode === REPORT_MODE.DETAIL
                    ? `1px solid ${BC_COLOURS.bc_black}`
                    : `1px solid ${BC_COLOURS.bc_text_box_border_grey}`,
                cursor: "pointer",
              }}
              onClick={() => {
                setReportMode(() => REPORT_MODE.DETAIL);
              }}
            >
              <FormControlLabel
                control={<Radio checked={reportMode === REPORT_MODE.DETAIL} />}
                label={<strong>Payment and Refund Detail</strong>}
              />
            </Paper>
          </Stack>
          {reportMode === REPORT_MODE.SUMMARY && <PaymentAndRefundSummary />}
          {reportMode === REPORT_MODE.DETAIL && <PaymentAndRefundDetail />}
        </Stack>
      </div>
    </>
  );
});

IDIRReportsDashboard.displayName = "IDIRReportsDashboard";
