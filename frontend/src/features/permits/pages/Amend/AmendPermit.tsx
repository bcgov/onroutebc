import { useState, useEffect, useContext, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box } from "@mui/material";

import { Permit } from "../../types/permit";
import { PERMIT_STATUSES, isPermitInactive } from "../../types/PermitStatus";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { AmendPermitContext } from "./context/AmendPermitContext";
import { Loading } from "../../../../common/pages/Loading";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { USER_AUTH_GROUP } from "../../../manageProfile/types/userManagement.d";
import { AmendPermitReview } from "./components/AmendPermitReview";
import { AmendPermitFinish } from "./components/AmendPermitFinish";
import { AmendPermitForm } from "./components/AmendPermitForm";
import { applyWhenNotNullable } from "../../../../common/helpers/util";
import { ERROR_ROUTES, IDIR_ROUTES } from "../../../../routes/constants";
import { hasPermitExpired } from "../../helpers/permitState";
import {
  useAmendmentApplicationQuery,
  usePermitDetailsQuery,
  usePermitHistoryQuery,
} from "../../hooks/hooks";

import {
  AmendPermitFormData,
  getDefaultFormDataFromPermit,
} from "./types/AmendPermitFormData";

import {
  SEARCH_BY_FILTERS,
  SEARCH_ENTITIES,
} from "../../../idir/search/types/types";

export const AMEND_PERMIT_STEPS = {
  Amend: "Amend",
  Review: "Review",
  Finish: "Finish",
} as const;

export type AmendPermitStep =
  (typeof AMEND_PERMIT_STEPS)[keyof typeof AMEND_PERMIT_STEPS];

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
const isAmendable = (permit: Permit) => {
  return (
    permit.permitStatus === PERMIT_STATUSES.ISSUED ||
    (!isPermitInactive(permit.permitStatus) &&
      !hasPermitExpired(permit.permitData.expiryDate))
  );
};

const isAmendableByUser = (authGroup?: string) => {
  return (
    authGroup === USER_AUTH_GROUP.PPCCLERK ||
    authGroup === USER_AUTH_GROUP.SYSADMIN
  );
};

const searchRoute = `${IDIR_ROUTES.SEARCH_RESULTS}?searchEntity=${SEARCH_ENTITIES.PERMIT}`
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
  const { amendmentApplication } =
    useAmendmentApplicationQuery(originalPermitId);

  const permitFormDefaultValues = () => {
    if (amendmentApplication) {
      return getDefaultFormDataFromPermit(amendmentApplication);
    }

    return getDefaultFormDataFromPermit(
      applyWhenNotNullable(
        (p) => ({
          ...p,
          comment: "",
        }),
        permit,
      ),
    );
  };

  // Permit form data, populated whenever permit is fetched
  const [permitFormData, setPermitFormData] = useState<AmendPermitFormData>(
    permitFormDefaultValues(),
  );

  useEffect(() => {
    setPermitFormData(permitFormDefaultValues());
  }, [amendmentApplication, permit]);

  const { currentStepIndex, step, back, next, goTo } = useMultiStepForm([
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
    const filteredLinks = allLinks.filter(
      (_, index) => index <= currentStepIndex + 1,
    );
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
    return (
      typeof permit === "undefined" ||
      typeof amendmentApplication === "undefined"
    );
  };

  const contextData = useMemo(
    () => ({
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
    }),
    [
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
      goHomeSuccess,
    ],
  );

  if (isLoadingState()) {
    return <Loading />;
  }

  if (!isAmendableByUser(idirUserDetails?.userAuthGroup)) {
    return <Navigate to={ERROR_ROUTES.UNAUTHORIZED} />;
  }

  if (!permit) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  if (!isAmendable(permit)) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  return (
    <AmendPermitContext.Provider value={contextData}>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner
          bannerText={displayHeaderText(step.key as AmendPermitStep)}
        />
      </Box>

      {step}
    </AmendPermitContext.Provider>
  );
};
