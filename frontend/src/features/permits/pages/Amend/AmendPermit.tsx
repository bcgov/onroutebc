import { useState, useEffect, useMemo, useContext } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Box } from "@mui/material";

import { Permit } from "../../types/permit";
import { PERMIT_STATUSES, isPermitInactive } from "../../types/PermitStatus";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { useMultiStepForm } from "../../hooks/useMultiStepForm";
import { AmendPermitContext } from "./context/AmendPermitContext";
import { Loading } from "../../../../common/pages/Loading";
import { AmendPermitReview } from "./components/AmendPermitReview";
import { AmendPermitFinish } from "./components/AmendPermitFinish";
import { AmendPermitForm } from "./components/AmendPermitForm";
import {
  APPLICATIONS_ROUTES,
  ERROR_ROUTES,
  IDIR_ROUTES,
} from "../../../../routes/constants";
import { hasPermitExpired } from "../../helpers/permitState";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";
import { Application } from "../../types/application";
import { Nullable } from "../../../../common/types/common";
import {
  useAmendmentApplicationQuery,
  usePermitDetailsQuery,
  usePermitHistoryQuery,
} from "../../hooks/hooks";

import {
  PERMIT_ACTION_ORIGINS,
  SEARCH_BY_FILTERS,
  SEARCH_ENTITIES,
} from "../../../idir/search/types/types";
import { PERMIT_TABS } from "../../types/PermitTabs";
import { USER_ROLE } from "../../../../common/authentication/types";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";

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

const searchRoute =
  `${IDIR_ROUTES.SEARCH_RESULTS}?searchEntity=${SEARCH_ENTITIES.PERMIT}` +
  `&searchByFilter=${SEARCH_BY_FILTERS.PERMIT_NUMBER}&searchString=`;

export const AmendPermit = () => {
  const { permitId: permitIdParam, companyId: companyIdParam } = useParams();

  const { state: stateFromNavigation } = useLocation();

  const companyId: number = applyWhenNotNullable(
    (id) => Number(id),
    companyIdParam,
    0,
  );
  const permitId = getDefaultRequiredVal("", permitIdParam);

  const navigate = useNavigate();

  // Query for permit data whenever this page is rendered, for the permit id
  const { data: permit } = usePermitDetailsQuery(companyId, permitId);

  
  // Get original permit id for the permit
  const originalPermitId = getDefaultRequiredVal("", permit?.originalPermitId);

  // Get permit history for original permit id
  const permitHistoryQuery = usePermitHistoryQuery(companyId, originalPermitId);
  const permitHistory = getDefaultRequiredVal([], permitHistoryQuery.data);

  // Get latest amendment application for the permit, if any
  const { data: latestAmendmentApplication } = useAmendmentApplicationQuery(
    companyId,
    originalPermitId,
  );

  const isLoadingState = () => {
    return (
      typeof permit === "undefined" ||
      typeof latestAmendmentApplication === "undefined"
    );
  };

  // Permit form data, populated whenever permit is fetched
  const [amendmentApplication, setAmendmentApplication] = useState<
    Nullable<Application>
  >(latestAmendmentApplication);

  useEffect(() => {
    setAmendmentApplication(latestAmendmentApplication);
  }, [latestAmendmentApplication]);

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

  const goHome = () =>
    stateFromNavigation.permitActionOrigin ===
    PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS
      ? navigate(APPLICATIONS_ROUTES.BASE, {
          state: {
            selectedTab: PERMIT_TABS.ACTIVE_PERMITS,
          },
        })
      : // return to global permit search results
        navigate(-1);

  const goHomeSuccess = () =>
    stateFromNavigation.permitActionOrigin ===
    PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS
      ? navigate(APPLICATIONS_ROUTES.BASE, {
          state: {
            selectedTab: PERMIT_TABS.ACTIVE_PERMITS,
          },
        })
      : // return to global permit search results
        navigate(fullSearchRoute);

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

  const contextData = useMemo(
    () => ({
      permit,
      amendmentApplication,
      permitHistory,
      setAmendmentApplication,
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
      amendmentApplication,
      permitHistory,
      setAmendmentApplication,
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

  const { idirUserDetails } = useContext(OnRouteBCContext);

  // unable to use permission matrix in this component, using manual role check instead
  const canAmendPermit = (role?: string) => {
    return (
      role === USER_ROLE.PPC_CLERK ||
      role === USER_ROLE.SYSTEM_ADMINISTRATOR ||
      role === USER_ROLE.CTPO
    );
  };

  if (!canAmendPermit(idirUserDetails?.userRole)) {
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
        <Banner bannerText={displayHeaderText(step.key as AmendPermitStep)} />
      </Box>

      {step}
    </AmendPermitContext.Provider>
  );
};
