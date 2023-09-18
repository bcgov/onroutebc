import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import { VoidPermitForm } from "./components/VoidPermitForm";
import { NotFound } from "../../../../common/pages/NotFound";
import { usePermitDetailsQuery } from "../../hooks/hooks";
import { Loading } from "../../../../common/pages/Loading";
import "./VoidPermit.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { VoidPermitContext } from "./context/VoidPermitContext";
import { SEARCH_RESULTS } from "../../../../routes/constants";
import { VoidPermitDto } from "./types/VoidPermitDto";
import { FinishVoid } from "./FinishVoid";
import { Breadcrumb } from "./components/Breadcrumb";
import { SEARCH_BY_FILTERS, SEARCH_ENTITIES } from "../../../idir/search/types/types";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import { USER_AUTH_GROUP } from "../../../manageProfile/types/userManagement.d";
import { Unauthorized } from "../../../../common/pages/Unauthorized";
import { Unexpected } from "../../../../common/pages/Unexpected";
import { isPermitInactive } from "../../types/PermitStatus";
import { hasPermitExpired } from "../../helpers/permitPDFHelper";
import { ReadPermitDto } from "../../types/permit";

const searchRoute = `${SEARCH_RESULTS}?searchEntity=${SEARCH_ENTITIES.PERMIT}`
  + `&searchByFilter=${SEARCH_BY_FILTERS.PERMIT_NUMBER}`;

const isVoidable = (permit: ReadPermitDto) => {
  return !isPermitInactive(permit.permitStatus) 
    && !hasPermitExpired(permit.permitData.expiryDate);
};

export const VoidPermit = () => {
  const navigate = useNavigate();

  // Must be SYSADMIN to access this page
  const { idirUserDetails } = useContext(OnRouteBCContext);
  if (idirUserDetails?.userAuthGroup !== USER_AUTH_GROUP.SYSADMIN) {
    return <Unauthorized />;
  }

  const { permitId } = useParams();
  if (!permitId) {
    return <NotFound />;
  }

  const [currentLink, setCurrentLink] = useState(0);

  const getBannerText = () => currentLink === 0 ? "Void Permit" : "Finish Voiding";

  const {
    query: permitQuery,
    permit
  } = usePermitDetailsQuery(permitId);

  const [voidPermitData, setVoidPermitData] = useState<VoidPermitDto>({
    permitId,
    reason: "",
    revoke: false,
    email: permit?.permitData?.contactDetails?.email,
    fax: permit?.permitData?.contactDetails?.fax,
  });

  useEffect(() => {
    setVoidPermitData({
      ...voidPermitData,
      email: permit?.permitData?.contactDetails?.email,
      fax: permit?.permitData?.contactDetails?.fax,
    });
  }, [
    permit?.permitData?.contactDetails?.email,
    permit?.permitData?.contactDetails?.fax,
  ]);

  // When querying permit details hasn't finished, show loading
  if (permitQuery.isLoading) return <Loading />;

  // When permit is not available, show not found
  if (!permit) return <NotFound />;

  // If permit is not voidable, show unexpected error page
  if (!isVoidable(permit)) return <Unexpected />;

  const getBasePermitNumber = () => {
    if (!permit?.permitNumber) return "";
    return permit.permitNumber.substring(0, 11);
  };
  const fullSearchRoute = `${searchRoute}&searchValue=${getBasePermitNumber()}`;

  const getLinks = () => currentLink === 0 ? [
    {
      text: "Search",
      onClick: () => navigate(fullSearchRoute),
    },
    {
      text: "Void Permit",
    },
  ] : [
    {
      text: "Search",
      onClick: () => navigate(fullSearchRoute),
    },
    {
      text: "Void Permit",
      onClick: () => setCurrentLink(0),
    },
    {
      text: "Finish Voiding",
    },
  ];

  const pages = [
    (
      <VoidPermitForm key="void-permit" permit={permit} />
    ),
    (
      <FinishVoid key="finish-void" permit={permit} />
    ),
  ];
  
  return (
    <VoidPermitContext.Provider
      value={{
        voidPermitData,
        setVoidPermitData,
        back: () => setCurrentLink(0),
        next: () => setCurrentLink(1),
      }}
    >
      {permitQuery.isLoading ? (
        <Loading />
      ) : (
        <div className="void-permit">
          <Banner bannerText={getBannerText()} extendHeight={true} />
          <Breadcrumb links={getLinks()} />
          {pages[currentLink]}
        </div>
      )}
    </VoidPermitContext.Provider>
  );
};
