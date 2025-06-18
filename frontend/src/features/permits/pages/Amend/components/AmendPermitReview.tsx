import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./AmendPermitReview.scss";
import { AmendPermitContext } from "../context/AmendPermitContext";
import { useCompanyInfoDetailsQuery } from "../../../../manageProfile/apiManager/hooks";
import { PermitReview } from "../../Application/components/review/PermitReview";
import { Breadcrumb } from "../../../../../common/components/breadcrumb/Breadcrumb";
import { getDefaultFormDataFromPermit } from "../types/AmendPermitFormData";
import { ReviewReason } from "./review/ReviewReason";
import { isValidTransaction } from "../../../helpers/payment";
import { getDatetimes } from "./helpers/getDatetimes";
import {
  useModifyAmendmentApplication,
  useSaveApplicationMutation,
} from "../../../hooks/hooks";
import {
  ERROR_ROUTES,
  SHOPPING_CART_ROUTES,
} from "../../../../../routes/constants";
import { DEFAULT_PERMIT_TYPE } from "../../../types/PermitType";
import { usePowerUnitSubTypesQuery } from "../../../../manageVehicles/hooks/powerUnits";
import { useTrailerSubTypesQuery } from "../../../../manageVehicles/hooks/trailers";
import { PERMIT_REVIEW_CONTEXTS } from "../../../types/PermitReviewContext";
import { usePolicyEngine } from "../../../../policy/hooks/usePolicyEngine";
import { useCommodityOptions } from "../../../hooks/useCommodityOptions";
import { useFetchSpecialAuthorizations } from "../../../../settings/hooks/specialAuthorizations";
import { useCalculateRefundAmount } from "../../../hooks/useCalculateRefundAmount";
import { serializePermitData } from "../../../helpers/serialize/serializePermitData";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../../common/helpers/util";
import { useAddToCart } from "../../../hooks/cart";
import { hasPermitsActionFailed } from "../../../helpers/permitState";
import { CartContext } from "../../../context/CartContext";
import { SnackBarContext } from "../../../../../App";
import { ApplicationFormData } from "../../../types/application";
import { deserializeApplicationResponse } from "../../../helpers/serialize/deserializeApplication";
import { isAxiosError } from "axios";

export const AmendPermitReview = () => {
  const navigate = useNavigate();
  const { companyId: companyIdParam } = useParams();
  const companyId: number = applyWhenNotNullable(
    (id) => Number(id),
    companyIdParam,
    0,
  );

  const {
    permit,
    amendmentApplication,
    setAmendmentApplication,
    permitHistory,
    back,
    next,
    getLinks,
  } = useContext(AmendPermitContext);

  // Send data to the backend API
  const modifyAmendmentMutation = useModifyAmendmentApplication();

  const { createdDateTime, updatedDateTime } = getDatetimes(
    amendmentApplication,
    permit,
  );

  const validTransactionHistory = permitHistory.filter((history) =>
    isValidTransaction(history.paymentMethodTypeCode, history.pgApproved),
  );

  const { data: companyInfo } = useCompanyInfoDetailsQuery(companyId);
  const doingBusinessAs = companyInfo?.alternateName;

  const permitType = getDefaultRequiredVal(
    DEFAULT_PERMIT_TYPE,
    amendmentApplication?.permitType,
    permit?.permitType,
  );
  const { data: specialAuthorizations } =
    useFetchSpecialAuthorizations(companyId);

  const policyEngine = usePolicyEngine(specialAuthorizations);
  const { commodityOptions } = useCommodityOptions(policyEngine, permitType);
  const powerUnitSubTypesQuery = usePowerUnitSubTypesQuery();
  const trailerSubTypesQuery = useTrailerSubTypesQuery();

  // For the confirmation checkboxes
  const [allConfirmed, setAllConfirmed] = useState(false);
  const [hasAttemptedSubmission, setHasAttemptedSubmission] = useState(false);

  const onSubmit = async () => {
    setHasAttemptedSubmission(true);
    if (!allConfirmed) return;

    if (!amendmentApplication) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    const { application: savedApplication } =
      await modifyAmendmentMutation.mutateAsync({
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
        companyId,
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

  const amountToRefund = useCalculateRefundAmount(
    validTransactionHistory,
    {
      permitType,
      permitData: amendmentApplication?.permitData
        ? serializePermitData(amendmentApplication.permitData)
        : {},
    },
    policyEngine,
  );

  const { setSnackBar } = useContext(SnackBarContext);
  const addToCartMutation = useAddToCart();

  const proceedWithAddToCart = async (
    companyId: number,
    applicationIds: string[],
    onSuccess: () => void,
  ) => {
    const addResult = await addToCartMutation.mutateAsync({
      companyId,
      applicationIds,
    });

    if (hasPermitsActionFailed(addResult)) {
      navigate(ERROR_ROUTES.UNEXPECTED);
    } else {
      onSuccess();
    }
  };

  const setShowSnackbar = () => true;
  const { refetchCartCount } = useContext(CartContext);

  const permitId = getDefaultRequiredVal("", amendmentApplication?.permitId);
  const applicationNumber = getDefaultRequiredVal(
    "",
    amendmentApplication?.applicationNumber,
  );

  const { mutateAsync: saveApplication } = useSaveApplicationMutation();

  const handleSaveApplication = async (
    followUpAction: (
      companyId: number,
      permitId: string,
      applicationNumber: string,
    ) => Promise<void>,
  ) => {
    setHasAttemptedSubmission(true);

    if (!allConfirmed) return;

    if (!companyId || !permitId || !applicationNumber) {
      return navigate(ERROR_ROUTES.UNEXPECTED);
    }

    await saveApplication(
      {
        data: amendmentApplication
          ? {
              ...amendmentApplication,
              permitData: amendmentApplication.permitData,
            }
          : ({} as ApplicationFormData),
        companyId,
      },
      {
        onSuccess: ({ data: savedApplication }) => {
          setAmendmentApplication(
            deserializeApplicationResponse(savedApplication),
          );
          followUpAction(companyId, permitId, applicationNumber);
        },
        onError: (e) => {
          console.error(e);
          if (isAxiosError(e)) {
            navigate(ERROR_ROUTES.UNEXPECTED, {
              state: {
                correlationId: e?.response?.headers["x-correlation-id"],
              },
            });
          } else {
            navigate(ERROR_ROUTES.UNEXPECTED);
          }
        },
      },
    );
  };

  const handleAddToCart = async () => {
    await handleSaveApplication(
      async (companyId, permitId, applicationNumber) => {
        await proceedWithAddToCart(companyId, [permitId], () => {
          setSnackBar({
            showSnackbar: true,
            setShowSnackbar,
            message: `Application ${applicationNumber} added to cart`,
            alertType: "success",
          });
          refetchCartCount();
          navigate(SHOPPING_CART_ROUTES.BASE);
        });
      },
    );
  };

  const continueBtnText = amountToRefund >= 0 ? "Continue" : undefined;

  console.log(amountToRefund);

  return (
    <div className="amend-permit-review">
      <Breadcrumb links={getLinks()} />

      <PermitReview
        reviewContext={PERMIT_REVIEW_CONTEXTS.AMEND}
        permitType={permitType}
        permitNumber={permit?.permitNumber}
        applicationNumber={amendmentApplication?.applicationNumber}
        isAmendAction={true}
        permitStartDate={amendmentApplication?.permitData?.startDate}
        permitDuration={amendmentApplication?.permitData?.permitDuration}
        permitExpiryDate={amendmentApplication?.permitData?.expiryDate}
        permitConditions={amendmentApplication?.permitData?.commodities}
        permittedCommodity={
          amendmentApplication?.permitData?.permittedCommodity
        }
        commodityOptions={commodityOptions}
        createdDateTime={createdDateTime}
        updatedDateTime={updatedDateTime}
        companyInfo={companyInfo}
        contactDetails={amendmentApplication?.permitData?.contactDetails}
        continueBtnText={continueBtnText}
        onEdit={back}
        onContinue={onSubmit}
        onAddToCart={handleAddToCart}
        allConfirmed={allConfirmed}
        setAllConfirmed={setAllConfirmed}
        hasAttemptedCheckboxes={hasAttemptedSubmission}
        powerUnitSubTypes={powerUnitSubTypesQuery.data}
        trailerSubTypes={trailerSubTypesQuery.data}
        vehicleDetails={amendmentApplication?.permitData?.vehicleDetails}
        vehicleWasSaved={
          amendmentApplication?.permitData?.vehicleDetails?.saveVehicle
        }
        vehicleConfiguration={
          amendmentApplication?.permitData?.vehicleConfiguration
        }
        route={amendmentApplication?.permitData?.permittedRoute}
        applicationNotes={amendmentApplication?.permitData?.applicationNotes}
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
        calculatedFee={`${-1 * amountToRefund}`}
        doingBusinessAs={doingBusinessAs}
        loas={amendmentApplication?.permitData?.loas}
        isStaffUser={true}
        thirdPartyLiability={
          amendmentApplication?.permitData?.thirdPartyLiability
        }
        conditionalLicensingFee={
          amendmentApplication?.permitData?.conditionalLicensingFee
        }
        companyId={companyId}
      >
        {amendmentApplication?.comment ? (
          <ReviewReason reason={amendmentApplication.comment} />
        ) : null}
      </PermitReview>
    </div>
  );
};
