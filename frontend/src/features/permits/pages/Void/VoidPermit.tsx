import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

import { VoidPermitForm } from "./components/VoidPermitForm";
import { usePermitDetailsQuery } from "../../hooks/hooks";
import { Loading } from "../../../../common/pages/Loading";
import "./VoidPermit.scss";
import { Banner } from "../../../../common/components/dashboard/components/banner/Banner";
import { VoidPermitContext } from "./context/VoidPermitContext";
import {
  APPLICATIONS_ROUTES,
  ERROR_ROUTES,
  IDIR_ROUTES,
} from "../../../../routes/constants";
import { VoidPermitFormData } from "./types/VoidPermit";
import { FinishVoid } from "./FinishVoid";
import { isPermitInactive } from "../../types/PermitStatus";
import { Permit } from "../../types/permit";
import {
  applyWhenNotNullable,
  getDefaultRequiredVal,
} from "../../../../common/helpers/util";
import { Breadcrumb } from "../../../../common/components/breadcrumb/Breadcrumb";
import { hasPermitExpired } from "../../helpers/permitState";
import {
  PERMIT_ACTION_ORIGINS,
  SEARCH_BY_FILTERS,
  SEARCH_ENTITIES,
} from "../../../idir/search/types/types";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";
import { PERMIT_TABS } from "../../types/PermitTabs";

const searchRoute =
  `${IDIR_ROUTES.SEARCH_RESULTS}?searchEntity=${SEARCH_ENTITIES.PERMIT}` +
  `&searchByFilter=${SEARCH_BY_FILTERS.PERMIT_NUMBER}`;

const isVoidable = (permit: Permit) => {
  return (
    !isPermitInactive(permit.permitStatus) &&
    !hasPermitExpired(permit.permitData.expiryDate)
  );
};

export const VoidPermit = () => {
  const navigate = useNavigate();
  const { state: stateFromNavigation } = useLocation();
  const { permitActionOrigin } = stateFromNavigation;

  const { permitId: permitIdParam, companyId: companyIdParam } = useParams();

  const companyId: number = applyWhenNotNullable(
    (id) => Number(id),
    companyIdParam,
    0,
  );
  const permitId = getDefaultRequiredVal("", permitIdParam);
  const [currentLink, setCurrentLink] = useState(0);
  const getBannerText = () =>
    currentLink === 0 ? "Void Permit" : "Finish Voiding";

  const permitQuery = usePermitDetailsQuery(companyId, permitId);
  const permit = permitQuery.data;

  const [voidPermitData, setVoidPermitData] = useState<VoidPermitFormData>({
    permitId: getDefaultRequiredVal("", permitId),
    reason: "",
    revoke: false,
    email: permit?.permitData?.contactDetails?.email,
    additionalEmail: permit?.permitData?.contactDetails?.additionalEmail,
  });

  useEffect(() => {
    setVoidPermitData({
      ...voidPermitData,
      email: permit?.permitData?.contactDetails?.email,
      additionalEmail: permit?.permitData?.contactDetails?.additionalEmail,
    });
  }, [
    permit?.permitData?.contactDetails?.email,
    permit?.permitData?.contactDetails?.additionalEmail,
  ]);

  const getBasePermitNumber = () => {
    if (!permit?.permitNumber) return "";
    return permit.permitNumber.substring(0, 11);
  };

  const fullSearchRoute = `${searchRoute}&searchString=${getBasePermitNumber()}`;
  const goHome = () =>
    permitActionOrigin === PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS
      ? navigate(APPLICATIONS_ROUTES.BASE, {
          state: {
            selectedTab: PERMIT_TABS.ACTIVE_PERMITS,
          },
        })
      : // return to global permit search results
        navigate(-1);

  const goHomeSuccess = () =>
    permitActionOrigin === PERMIT_ACTION_ORIGINS.ACTIVE_PERMITS
      ? navigate(APPLICATIONS_ROUTES.BASE, {
          state: {
            selectedTab: PERMIT_TABS.ACTIVE_PERMITS,
          },
        })
      : // return to global permit search results
        navigate(fullSearchRoute);
  const handleFail = () => navigate(ERROR_ROUTES.UNEXPECTED);

  const getLinks = () =>
    currentLink === 0
      ? [
          {
            text: "Search",
            onClick: goHome,
          },
          {
            text: "Void Permit",
          },
        ]
      : [
          {
            text: "Search",
            onClick: goHome,
          },
          {
            text: "Void Permit",
            onClick: () => setCurrentLink(0),
          },
          {
            text: "Finish Voiding",
          },
        ];

  const contextData = useMemo(
    () => ({
      voidPermitData,
      setVoidPermitData,
      back: () => setCurrentLink(0),
      next: () => setCurrentLink(1),
    }),
    [voidPermitData],
  );

  const canVoidPermit = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "GLOBAL_SEARCH",
      permissionMatrixFunctionKey: "VOID_PERMIT",
    },
  });

  // If user is not SYSADMIN, show unauthorized page
  if (!canVoidPermit) {
    return <Navigate to={ERROR_ROUTES.UNAUTHORIZED} />;
  }

  // If permitId is not provided in the route, show not found page
  if (!permitId) {
    return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;
  }

  // When querying permit details hasn't finished, show loading
  if (typeof permit === "undefined") return <Loading />;

  // When permit is not available, show not found
  if (!permit) return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;

  // If permit is not voidable, show unexpected error page
  if (!isVoidable(permit)) return <Navigate to={ERROR_ROUTES.UNEXPECTED} />;

  const pages = [
    <VoidPermitForm
      key="void-permit"
      permit={permit}
      onRevokeSuccess={goHomeSuccess}
      onCancel={goHome}
      onFail={handleFail}
    />,
    <FinishVoid
      key="finish-void"
      permit={permit}
      onSuccess={goHomeSuccess}
      onFail={handleFail}
    />,
  ];

  return (
    <VoidPermitContext.Provider value={contextData}>
      {permitQuery.isPending ? (
        <Loading />
      ) : (
        <div className="void-permit">
          <Banner bannerText={getBannerText()} />
          <Breadcrumb links={getLinks()} />
          {pages[currentLink]}
        </div>
      )}
    </VoidPermitContext.Provider>
  );
};
