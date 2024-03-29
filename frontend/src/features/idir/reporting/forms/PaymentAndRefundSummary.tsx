import { Button, Divider, FormGroup, Stack } from "@mui/material";
import dayjs from "dayjs";
import { FormProvider, useForm } from "react-hook-form";
import { useContext, useState } from "react";

import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";
import { getPaymentAndRefundSummary } from "../api/reports";
import { IssuedByCheckBox } from "./subcomponents/IssuedByCheckBox";
import { ReportDateTimePickers } from "./subcomponents/ReportDateTimePickers";
import { SnackBarContext } from "../../../../App";
import { Loading } from "../../../../common/pages/Loading";
import {
  PaymentAndRefundSummaryFormData,
  PaymentAndRefundSummaryRequest,
  REPORT_ISSUED_BY,
} from "../types/types";

/**
 * Component for Payment and Refund Summary form
 */
export const PaymentAndRefundSummary = () => {
  const { setSnackBar } = useContext(SnackBarContext);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const formMethods = useForm<PaymentAndRefundSummaryFormData>({
    defaultValues: {
      issuedBy: ["SELF_ISSUED", "PPC"],
      fromDateTime: dayjs()
        .subtract(1, "day")
        .set("h", 21)
        .set("m", 0)
        .set("s", 0)
        .set("ms", 0),
      toDateTime: dayjs().set("h", 20).set("m", 59).set("s", 59).set("ms", 999),
    },
    reValidateMode: "onBlur",
  });

  const { watch, handleSubmit } = formMethods;

  const issuedBy = watch("issuedBy");
  const fromDateTime = watch("fromDateTime");
  const toDateTime = watch("toDateTime");

  /**
   * Opens the report in a new tab.
   */
  const onClickViewReport = async () => {
    setIsGeneratingReport(() => true);
    try {
      const { blobObj: blobObjWithoutType } = await getPaymentAndRefundSummary({
        fromDateTime: fromDateTime.toISOString(),
        toDateTime: toDateTime.toISOString(),
        issuedBy,
      } as PaymentAndRefundSummaryRequest);
      openBlobInNewTab(blobObjWithoutType);
    } catch (err) {
      console.error(err);
      setSnackBar({
        message: "An unexpected error occurred.",
        showSnackbar: true,
        setShowSnackbar: () => true,
        alertType: "error",
      });
    } finally {
      setIsGeneratingReport(() => false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Stack style={{ width: "900px" }} spacing={2}>
        <h2>Payment and Refund Summary</h2>
        <Divider
          flexItem
          orientation="horizontal"
          color={BC_COLOURS.bc_border_grey}
        />
        {isGeneratingReport && <Loading />}
        {!isGeneratingReport && (
          <FormGroup>
            <span>
              <strong>Issued By</strong>
            </span>
            <Stack direction="row" spacing={5}>
              <IssuedByCheckBox
                issuedByOption={REPORT_ISSUED_BY.SELF_ISSUED}
                label="Self Issued"
              />
              <IssuedByCheckBox
                issuedByOption={REPORT_ISSUED_BY.PPC}
                label="PPC"
              />
            </Stack>
            <br />
            <Stack direction="row" spacing={3}>
              <ReportDateTimePickers />
            </Stack>
            <br />
            <Stack direction="row">
              <Button
                disabled={issuedBy.length === 0}
                key="view-report-button"
                aria-label="View Report"
                variant="contained"
                color="primary"
                onClick={handleSubmit(onClickViewReport)}
              >
                View Report
              </Button>
            </Stack>
          </FormGroup>
        )}
      </Stack>
    </FormProvider>
  );
};
