import { useParams } from "react-router-dom";
import { VoidPermitHeader } from "./components/VoidPermitHeader";
import { VoidPermitForm } from "./components/VoidPermitForm";
import { NotFound } from "../../../../common/pages/NotFound";
import { usePermitDetailsQuery } from "../../hooks/hooks";
import { Loading } from "../../../../common/pages/Loading";

import "./VoidPermit.scss";

export const VoidPermit = () => {
  const { permitId } = useParams();
  if (!permitId) {
    return <NotFound />;
  }

  const {
    query: permitQuery,
    permit
  } = usePermitDetailsQuery(permitId);
  
  return (
    <div className="void-permit">
      <div className="void-permit__title">
        Void Permit
      </div>
      {permitQuery.isLoading ? (
        <Loading />
      ) : (
        <VoidPermitHeader permit={permit} />
      )}
      <VoidPermitForm 
        permitId={permitId}
        email={permit?.permitData?.contactDetails?.email}
        fax={permit?.permitData?.contactDetails?.fax}
        feeSummary={permit?.permitData?.feeSummary}
        permitDuration={permit?.permitData?.permitDuration}
      />
    </div>
  );
};
