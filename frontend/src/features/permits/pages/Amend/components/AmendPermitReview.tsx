import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./AmendPermitReview.scss";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { PermitReview } from "../../Application/components/review/PermitReview";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { getDefaultFormDataFromPermit } from "../types/AmendPermitFormData";
import { ReviewReason } from "./review/ReviewReason";
import { calculateAmountToRefund } from "../../../helpers/feeSummary";
import { isValidTransaction } from "../../../helpers/payment";
import { getDatetimes } from "./helpers/getDatetimes";
import { useModifyAmendmentApplication } from "../../../hooks/hooks";
import { ERROR_ROUTES } from "../../../../../routes/constants";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import { usePowerUnitSubTypesQuery } from "../../../../manageVehicles/hooks/powerUnits";
import { useTrailerSubTypesQuery } from "../../../../manageVehicles/hooks/trailers";
import { useFetchSpecialAuthorizations } from "../../../../settings/hooks/specialAuthorizations";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";

export const AmendPermitReview = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const {
    data: specialAuth,
  } = useFetchSpecialAuthorizations(companyId as string);
  
  const isNoFeePermitType = Boolean(specialAuth?.noFeeType);

  const {
    permit,
    amendmentApplication,
    setAmendmentApplication,
    permitHistory,
    back,
    next,
    getLinks,
  } =
    useContext(AmendPermitContext);

  // Send data to the backend API
  const modifyAmendmentMutation = useModifyAmendmentApplication();

  const { createdDateTime, updatedDateTime } = getDatetimes(amendmentApplication, permit);

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);
  const doingBusinessAs = companyInfo?.alternateName;

  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();

  // For the confirmation checkboxes
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async () => {
    setIsSubmitted(true);
    if (!isChecked) return;

    if (!amendmentApplication) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    const { application: savedApplication } = await modifyAmendmentMutation.mutateAsync({
      applicationId: getDefaultRequiredVal(
        "",
        amendmentApplication?.permitId,
      ),
      application: {
        ...amendmentApplication,
        permitData: {
          ...amendmentApplication.permitData,
          doingBusinessAs, // always set most recent company info DBA
        },
      },
      companyId: companyId as string,
    });

    if (savedApplication) {
      setAmendmentApplication(savedApplication);
      next();
    } else {
      navigate(ERROR_ROUTES.UNEXPECTED);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const oldFields = getDefaultFormDataFromPermit(companyInfo, permit);

  const amountToRefund =
    -1 *
    calculateAmountToRefund(
      validTransactionHistory,
      getDefaultRequiredVal(
        0,
        amendmentApplication?.permitData?.permitDuration,
      ),
      getDefaultRequiredVal(
        DEFAULT_PERMIT_TYPE,
        amendmentApplication?.permitType,
        permit?.permitType,
      ),
      isNoFeePermitType,
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
