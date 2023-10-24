import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";

import { ReadPermitDto } from "../../types/permit";
import { PERMIT_STATUSES, isPermitInactive } from "../../types/PermitStatus";
import { hasPermitExpired } from "../../helpers/permitPDFHelper";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { AmendPermitContext } from "./context/AmendPermitContext";
import { useAmendmentApplicationQuery, usePermitDetailsQuery, usePermitHistoryQuery } from "../../hooks/hooks";
import { Loading } from "../../../../common/pages/Loading";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { USER_AUTH_GROUP } from "../../../manageProfile/types/userManagement.d";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { NotFound } from "../../../../common/pages/NotFound";
import { Unexpected } from "../../../../common/pages/Unexpected";
import { AmendPermitReview } from "./components/AmendPermitReview";
import { AmendPermitFinish } from "./components/AmendPermitFinish";
import { AmendPermitForm } from "./components/AmendPermitForm";
import { AmendPermitFormData, getPermitFormDefaultValues } from "./types/AmendPermitFormData";
import { SEARCH_RESULTS } from "../../../../routes/constants";
import { SEARCH_BY_FILTERS, SEARCH_ENTITIES } from "../../../idir/search/types/types";
import { applyWhenNotNullable } from "../../../../common/helpers/util";

export const AMEND_PERMIT_STEPS = {
  Amend: "Amend",
  Review: "Review",
  Finish: "Finish",
} as const;

export type AmendPermitStep = typeof AMEND_PERMIT_STEPS[keyof typeof AMEND_PERMIT_STEPS];

const displayHeaderText = (stepKey: AmendPermitStep) => {
  switch (stepKey) {
    case AMEND_PERMIT_STEPS.Amend:
      return "Amend Permit";
    case AMEND_PERMIT_STEPS.Review:
      return "Review and Confirm Details";
    case AMEND_PERMIT_STEPS.Finish:
      return "Finish Amendment";
  }
};

/**
 * Determine if a permit is amendable (ie. if it's ISSUED or is active)
 * @param permit Permit to amend
 * @returns whether or not the permit is amendable
 */
const isAmendable = (permit: ReadPermitDto) => {
  return permit.permitStatus === PERMIT_STATUSES.ISSUED 
    || (!isPermitInactive(permit.permitStatus) && !hasPermitExpired(permit.permitData.expiryDate));
};

const isAmendableByUser = (authGroup?: string) => {
  return authGroup === USER_AUTH_GROUP.PPCCLERK || authGroup === USER_AUTH_GROUP.SYSADMIN;
};

const searchRoute = `${SEARCH_RESULTS}?searchEntity=${SEARCH_ENTITIES.PERMIT}`
  + `&searchByFilter=${SEARCH_BY_FILTERS.PERMIT_NUMBER}&searchValue=`;

export const AmendPermit = () => {
  const { permitId } = useParams();
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const navigate = useNavigate();

  // Query for permit data whenever this page is rendered, for the permit id
  const { permit } = usePermitDetailsQuery(permitId);

  // Get original permit id for the permit
  const originalPermitId = permit?.originalPermitId;

  // Get permit history for original permit id
  const { permitHistory } = usePermitHistoryQuery(originalPermitId);

  // Get latest amendment application, if any
  const { amendmentApplication } = useAmendmentApplicationQuery(originalPermitId);

  // Permit form data, populated whenever permit is fetched
  const [permitFormData, setPermitFormData] = useState<AmendPermitFormData>(
    getPermitFormDefaultValues(
      amendmentApplication ? amendmentApplication : applyWhenNotNullable(p => ({
        ...p,
        comment: "",
      }), permit)
    )
  );

  useEffect(() => {
    setPermitFormData(
      getPermitFormDefaultValues(
        amendmentApplication ? amendmentApplication : applyWhenNotNullable(p => ({
          ...p,
          comment: "",
        }), permit)
      )
    );
  }, [amendmentApplication, permit]);

  const {
    currentStepIndex,
    step,
    back,
    next,
    goTo,
  } = useMultiStepForm([
    <AmendPermitForm key={AMEND_PERMIT_STEPS.Amend} />,
    <AmendPermitReview key={AMEND_PERMIT_STEPS.Review} />,
    <AmendPermitFinish key={AMEND_PERMIT_STEPS.Finish} />,
  ]);

  const getBasePermitNumber = () => {
    if (!permit?.permitNumber) return "";
    return permit.permitNumber.substring(0, 11);
  };
  const fullSearchRoute = `${searchRoute}${getBasePermitNumber()}`;

  const goHome = () => navigate(searchRoute);
  const goHomeSuccess = () => navigate(fullSearchRoute);

  const allLinks = [
    {
      text: "Search",
      onClick: () => goHome(),
    },
    {
      text: "Amend Permit",
      onClick: () => goTo(0),
    },
    {
      text: "Review and Confirm Details",
      onClick: () => goTo(1),
    },
    {
      text: "Finish Amendment",
    },
  ];

  const getLinks = () => {
    const filteredLinks = allLinks.filter((_, index) => index <= currentStepIndex + 1);
    return filteredLinks.map((link, index) => {
      if (index === currentStepIndex + 1) {
        return {
          text: link.text,
        };
      }
      return link;
    });
  };

  const isLoadingState = () => {
    return typeof permit === "undefined" 
      || typeof amendmentApplication === "undefined";
  };

  if (isLoadingState()) {
    return <Loading />;
  }

  if (!isAmendableByUser(idirUserDetails?.userAuthGroup)) {
    return <Unauthorized />;
  }

  if (!permit) {
    return <NotFound />;
  }

  if (!isAmendable(permit)) {
    return <Unexpected />;
  }

  return (
    <AmendPermitContext.Provider
      value={{
        permit,
        permitFormData,
        permitHistory,
        setPermitFormData,
        next,
        back,
        goTo,
        currentStepIndex,
        getLinks,
        goHome,
        afterFinishAmend: goHomeSuccess,
      }}
    >
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner
          bannerText={displayHeaderText(step.key as AmendPermitStep)}
          extendHeight={true}
        />
      </Box>

      {step}
    </AmendPermitContext.Provider>
  );
};
