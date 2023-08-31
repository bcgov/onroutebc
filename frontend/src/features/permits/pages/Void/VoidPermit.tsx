import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { VoidPermitForm } from "./components/VoidPermitForm";
import { NotFound } from "../../../../common/pages/NotFound";
import { usePermitDetailsQuery } from "../../hooks/hooks";
import { Loading } from "../../../../common/pages/Loading";
import "./VoidPermit.scss";
import { Banner } from "../../../../common/components/dashboard/Banner";
import { VoidPermitContext } from "./context/VoidPermitContext";
import { SEARCH_RESULTS } from "../../../../routes/constants";
import { VoidPermitDto } from "./types/VoidPermitDto";
import { RefundPermitStep } from "./RefundPermitStep";
import { Breadcrumb } from "./components/Breadcrumb";

const searchRoute = `${SEARCH_RESULTS}?searchEntity=permits`;

export const VoidPermit = () => {
  const navigate = useNavigate();
  const { permitId } = useParams();
  if (!permitId) {
    return <NotFound />;
  }

  const [currentLink, setCurrentLink] = useState(0);

  const getLinks = () => currentLink === 0 ? [
    {
      text: "Search",
      onClick: () => navigate(searchRoute),
    },
    {
      text: "Void Permit",
    },
  ] : [
    {
      text: "Search",
      onClick: () => navigate(searchRoute),
    },
    {
      text: "Void Permit",
      onClick: () => setCurrentLink(0),
    },
    {
      text: "Refund Permit",
    },
  ];

  const getBannerText = () => currentLink === 0 ? "Void Permit" : "Refund Permit";

  const {
    query: permitQuery,
    permit
  } = usePermitDetailsQuery(permitId);

  const [voidPermitData, setVoidPermitData] = useState<VoidPermitDto>({
    permitId,
    reason: "",
    revoke: false,
    refund: true,
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

  if (permitQuery.isLoading) return <Loading />;

  const pages = [
    (
      <VoidPermitForm key="void-permit" permit={permit} />
    ),
    (
      <RefundPermitStep key="refund-permit" />
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
