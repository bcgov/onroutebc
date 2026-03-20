import { Button, Divider, FormGroup, Stack } from "@mui/material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import { SnackBarContext } from "../../../../App";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { IDIR_USER_ROLE } from "../../../../common/authentication/types";
import { ONE_HOUR } from "../../../../common/constants/constants";
import { Loading } from "../../../../common/pages/Loading";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { openBlobInNewTab } from "../../../permits/helpers/permitPDFHelper";
import { getPaymentAndRefundDetail, usePermitTypesQuery } from "../api/reports";
import { getPermitIssuers } from "../api/users";
import { IssuedByCheckBox } from "./subcomponents/IssuedByCheckBox";
import { PaymentMethodSelect } from "./subcomponents/PaymentMethodSelect";
import { PermitTypeSelect } from "./subcomponents/PermitTypeSelect";
import { ReportDateTimePickers } from "./subcomponents/ReportDateTimePickers";
import { UserSelect } from "./subcomponents/UserSelect";
import {
  ALL_CONSOLIDATED_PAYMENT_METHODS,
  AllPaymentMethodAndCardTypeCodes,
  CONSOLIDATED_PAYMENT_METHODS,
} from "../../../../common/types/paymentMethods";

import {
  PaymentAndRefundDetailFormData,
  PaymentAndRefundDetailRequest,
  REPORT_ISSUED_BY,
  ReadUserDtoForReport,
} from "../types/types";

/**
 * Component for Payment and Refund Detail form
 */
export const PaymentAndRefundDetail = () => {
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const { user: idirUserFromAuthContext } = useAuth();
  const canSelectPermitIssuers =
    idirUserDetails?.userRole === IDIR_USER_ROLE.SYSTEM_ADMINISTRATOR ||
    idirUserDetails?.userRole === IDIR_USER_ROLE.HQ_ADMINISTRATOR ||
    idirUserDetails?.userRole === IDIR_USER_ROLE.FINANCE;
  // GET the permit types.
  const permitTypesQuery = usePermitTypesQuery();
  const { setSnackBar } = useContext(SnackBarContext);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  const { data: permitTypes, isPending: isPermitTypeQueryLoading } =
    permitTypesQuery;

  // GET the list of users who have issued a permit.
  const permitIssuersQuery = useQuery({
    queryKey: ["permitIssuers"],
    queryFn: getPermitIssuers,
    /**
     * Transform the data array { userName, userGUID }
     * into an object with userName as the key and userGUID as the pair.
     * This is a more efficient representation.
     *
     * @param data ReadUserDto array.
     * @returns A record with userName as key and userGUID as value.
     */
    select: (data: ReadUserDtoForReport[]) => {
      if (!data) return [];
      return Object.fromEntries(
        data.map(({ userGUID, userName }) => [userName, userGUID]),
      ) as Record<string, string>;
    },
    placeholderData: keepPreviousData,
    // Only query the permit issuers when the user is sysadmin.
    enabled: canSelectPermitIssuers,
    staleTime: ONE_HOUR,
    retry: false,
    refetchOnWindowFocus: false, // prevents unnecessary queries
  });

  const { data: permitIssuers, isPending: isPermitIssuersQueryLoading } =
    permitIssuersQuery;

  const formMethods = useForm<PaymentAndRefundDetailFormData>({
    defaultValues: {
      issuedBy: [REPORT_ISSUED_BY.SELF_ISSUED, REPORT_ISSUED_BY.PPC],
      fromDateTime: dayjs()
        .subtract(1, "day")
        .set("h", 21)
        .set("m", 0)
        .set("s", 0)
        .set("ms", 0),
      toDateTime: dayjs().set("h", 20).set("m", 59).set("s", 59).set("ms", 999),
      paymentMethods: Object.keys(CONSOLIDATED_PAYMENT_METHODS),
      permitType: Object.keys(permitTypes ?? []),
      // permitIssuers is a <userName, userGUID> record.
      // So, Object.values is what we need.
      users: canSelectPermitIssuers
        ? Object.values(permitIssuers ?? {})
        : // If user is not a sys admin, only their own guid is populated.
          [idirUserFromAuthContext?.profile?.idir_user_guid as string],
    },
    reValidateMode: "onBlur",
  });

  const { watch, setValue, handleSubmit } = formMethods;

  const issuedBy = watch("issuedBy");
  const fromDateTime = watch("fromDateTime");
  const toDateTime = watch("toDateTime");
  const selectedPaymentMethods = watch("paymentMethods");
  const selectedPermitTypes = watch("permitType");
  const selectedUsers = watch("users");

  const isAllPaymentMethodsSelected =
    Object.keys(CONSOLIDATED_PAYMENT_METHODS).length ===
    selectedPaymentMethods?.length;

  const isAllPermitTypesSelected =
    permitTypes &&
    Object.keys(permitTypes).length === selectedPermitTypes.length;

  useEffect(() => {
    if (permitTypes) {
      setValue("permitType", Object.keys(permitTypes));
    }
  }, [isPermitTypeQueryLoading]);

  useEffect(() => {
    if (permitIssuers) {
      // permitIssuers is a <userName, userGUID> record.
      // So, Object.values is what we need.
      setValue("users", Object.values(permitIssuers));
    }
  }, [isPermitIssuersQueryLoading]);

  /**
   * Uses the CONSOLIDATED PAYMENT METHODS object to get
   * 1) paymentMethodTypeCode
   * 2) paymentCardTypeCode
   * and presents it as an array.
   *
   * @returns The transformed payment codes aligned with API specification.
   */
  const transformSelectedPaymentMethods =
    (): AllPaymentMethodAndCardTypeCodes[] => {
      const paymentCodes: AllPaymentMethodAndCardTypeCodes[] = [];
      if (isAllPaymentMethodsSelected) {
        const { paymentMethodTypeCode } =
          ALL_CONSOLIDATED_PAYMENT_METHODS["All Payment Methods"];
        paymentCodes.push({ paymentMethodTypeCode });
      }
      return paymentCodes.concat(
        selectedPaymentMethods
          ? selectedPaymentMethods.map((key: string) => {
              const { paymentMethodTypeCode, paymentCardTypeCode } =
                ALL_CONSOLIDATED_PAYMENT_METHODS[key];
              const paymentCodes: AllPaymentMethodAndCardTypeCodes = {
                paymentMethodTypeCode,
              };
              if (paymentCardTypeCode) {
                paymentCodes.paymentCardTypeCode = paymentCardTypeCode;
              }
              return paymentCodes;
            })
          : [],
      );
    };

  /**
   * @returns A string array containing the permit types.
   */
  const transformSelectedPermitTypes = (): string[] => {
    return isAllPermitTypesSelected
      ? ["ALL"].concat(selectedPermitTypes)
      : selectedPermitTypes;
  };

  /**
   * Opens the report in a new tab.
   * Displays an error if unable to fetch the report.
   */
  const onClickViewReport = async () => {
    try {
      setIsGeneratingReport(() => true);
      const requestObj: PaymentAndRefundDetailRequest = {
        fromDateTime: fromDateTime.toISOString(),
        toDateTime: toDateTime.toISOString(),
        issuedBy: issuedBy,
        paymentCodes: transformSelectedPaymentMethods(),
        permitType: transformSelectedPermitTypes(),
      };
      if (issuedBy.includes(REPORT_ISSUED_BY.PPC)) {
        requestObj.users = selectedUsers;
      }
      const { blobObj: blobObjWithoutType } =
        await getPaymentAndRefundDetail(requestObj);
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
        <h2>Payment and Refund Detail</h2>
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
            <Stack spacing={2}>
              <Stack direction="row">
                <PermitTypeSelect permitTypes={permitTypes} />
              </Stack>
              <Stack>
                <PaymentMethodSelect />
              </Stack>
              {canSelectPermitIssuers && (
                <Stack direction="row">
                  <UserSelect
                    permitIssuers={permitIssuers}
                    key="user-select-subcomponent"
                  />
                </Stack>
              )}
              <Stack direction="row" spacing={3}>
                <ReportDateTimePickers enableDateRangeValidation={true}/>
              </Stack>
              <br />
              <Stack direction="row">
                <Button
                  key="view-report-button"
                  aria-label="View Report"
                  variant="contained"
                  color="primary"
                  disabled={issuedBy.length === 0}
                  onClick={handleSubmit(onClickViewReport)}
                >
                  View Report
                </Button>
              </Stack>
            </Stack>
          </FormGroup>
        )}
      </Stack>
    </FormProvider>
  );
};
