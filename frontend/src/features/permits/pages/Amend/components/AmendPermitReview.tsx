import { useContext, useEffect, useState } from "react";

import "./AmendPermitReview.scss";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { PermitReview } from "../../Application/components/review/PermitReview";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { getDefaultFormDataFromPermit } from "../types/AmendPermitFormData";
import { ReviewReason } from "./review/ReviewReason";
import { calculateAmountToRefund } from "../../../helpers/feeSummary";
import { isValidTransaction } from "../../../helpers/payment";
import OnRouteBCContext from "../../../../../common/authentication/OnRouteBCContext";
import { getDatetimes } from "./helpers/getDatetimes";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";

import {
  usePowerUnitSubTypesQuery,
  useTrailerSubTypesQuery,
} from "../../../../manageVehicles/apiManager/hooks";

export const AmendPermitReview = () => {
  const { permit, amendmentApplication, permitHistory, back, next, getLinks } =
    useContext(AmendPermitContext);

  const { createdDateTime, updatedDateTime } = getDatetimes(
    amendmentApplication,
    permit,
  );

  const { companyLegalName, idirUserDetails } = useContext(OnRouteBCContext);

  const isStaffActingAsCompany = Boolean(idirUserDetails?.userAuthGroup);
  const doingBusinessAs =
    isStaffActingAsCompany && companyLegalName ? companyLegalName : "";

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const { data: companyInfo } = useCompanyInfoDetailsQuery(
    getDefaultRequiredVal(0, amendmentApplication?.companyId),
  );
  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async () => {
    setIsSubmitted(true);
    if (!isChecked) return;
    next();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const oldFields = getDefaultFormDataFromPermit(permit);

  const amountToRefund =
    -1 *
    calculateAmountToRefund(
      validTransactionHistory,
      getDefaultRequiredVal(
        0,
        amendmentApplication?.permitData?.permitDuration,
      ),
    );

  return (
    <div className="amend-permit-review">
      <Breadcrumb links={getLinks()} />

      <PermitReview
        permitType={amendmentApplication?.permitType}
        permitNumber={permit?.permitNumber}
        applicationNumber={amendmentApplication?.applicationNumber}
        isAmendAction={true}
        permitStartDate={amendmentApplication?.permitData?.startDate}
        permitDuration={amendmentApplication?.permitData?.permitDuration}
        permitExpiryDate={amendmentApplication?.permitData?.expiryDate}
        permitConditions={amendmentApplication?.permitData?.commodities}
        createdDateTime={createdDateTime}
        updatedDateTime={updatedDateTime}
        companyInfo={companyInfo}
        contactDetails={amendmentApplication?.permitData?.contactDetails}
        continueBtnText="Continue"
        onEdit={back}
        onContinue={onSubmit}
        allChecked={isChecked}
        setAllChecked={setIsChecked}
        hasAttemptedCheckboxes={isSubmitted}
        powerUnitSubTypes={powerUnitSubTypesQuery.data}
        trailerSubTypes={trailerSubTypesQuery.data}
        vehicleDetails={amendmentApplication?.permitData?.vehicleDetails}
        vehicleWasSaved={
          amendmentApplication?.permitData?.vehicleDetails?.saveVehicle
        }
        showChangedFields={true}
        oldFields={{
          ...oldFields,
          permitId: applyWhenNotNullable((id) => `${id}`, oldFields.permitId),
          permitData: {
            ...oldFields.permitData,
            companyName: getDefaultRequiredVal(
              "",
              oldFields.permitData.companyName,
            ),
            clientNumber: getDefaultRequiredVal(
              "",
              oldFields.permitData.clientNumber,
            ),
          },
        }}
        calculatedFee={`${amountToRefund}`}
        doingBusinessAs={doingBusinessAs}
      >
        {amendmentApplication?.comment ? (
          <ReviewReason reason={amendmentApplication.comment} />
        ) : null}
      </PermitReview>
    </div>
  );
};
