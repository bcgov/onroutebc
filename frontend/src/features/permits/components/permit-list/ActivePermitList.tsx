
import { InfoBcGovBanner } from "../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../common/constants/bannerMessages";
import "./ActivePermitList.scss";
import { BasePermitList } from "./BasePermitList";

/**
 * A wrapper with the query to load the table with active permits.
 */
export const ActivePermitList = () => {
  return (
    <div className="table-container">
      <InfoBcGovBanner msg={BANNER_MESSAGES.PERMIT_REFUND_REQUEST} />
      <BasePermitList />
    </div>
  );
};

ActivePermitList.displayName = "ActivePermitList";
