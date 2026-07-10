import "./WarningBanner.scss";
import { WarningBcGovBanner } from "../../../../../../../../common/components/banners/WarningBcGovBanner";
import { CustomExternalLink } from "../../../../../../../../common/components/links/CustomExternalLink";
import {
  CTPM_CHAPTER_5_TITLE,
  ONROUTE_WEBPAGE_LINKS,
} from "../../../../../../../../routes/constants";

export const WarningBanner = () => {
  return (
    <div className="warning-banner">
      <WarningBcGovBanner
        msg={"Review Compliance Requirements"}
        className="warning-banner__header"
      />
      <div className="warning-banner__body">
        <p className="warning-banner__text">
          Wheelbase for Axle Unit X and Axle Unit Y is between 6.2m and 7.2m.
          Semi-Trailer wheelbase must be within dimensions table found in{" "}
          <CustomExternalLink
            href={ONROUTE_WEBPAGE_LINKS.CTPM_CHAPTER_5}
            className="warning-banner__text--link"
            openInNewTab={true}
          >
            {CTPM_CHAPTER_5_TITLE}
          </CustomExternalLink>
        </p>
      </div>
    </div>
  );
};
