import "./PermitNotRequiredBanner.scss";
import { WarningBcGovBanner } from "../../../../../../../../common/components/banners/WarningBcGovBanner";
import { CustomExternalLink } from "../../../../../../../../common/components/links/CustomExternalLink";
import {
  PPC_EMAIL,
  TOLL_FREE_NUMBER,
} from "../../../../../../../../common/constants/constants";
import { ONROUTE_WEBPAGE_LINKS } from "../../../../../../../../routes/constants";

export const PermitNotRequiredBanner = () => {
  return (
    <div className="permit-not-required-banner">
      <WarningBcGovBanner
        msg={"You may require a different permit type"}
        className="permit-not-required-banner__header"
      />
      <div className="permit-not-required-banner__body">
        <p className="permit-not-required-banner__text">
          Refer to the{" "}
          <CustomExternalLink
            href={ONROUTE_WEBPAGE_LINKS.COMMERCIAL_TRANSPORT_PROCEDURES}
            className="permit-not-required-banner__text--link"
            openInNewTab={true}
          >
            Commercial Transport Procedures Manual
          </CustomExternalLink>
          , or contact the Provincial Permit Centre at{" "}
          <strong>
            Toll-free:
            {TOLL_FREE_NUMBER}
          </strong>{" "}
          or <strong>Email: {PPC_EMAIL}</strong>
        </p>
      </div>
    </div>
  );
};
