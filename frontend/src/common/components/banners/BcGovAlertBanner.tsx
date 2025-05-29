import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faCheckCircle,
  faInfoCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import "./BcGovAlertBanner.scss";
import { ALERT_BANNER_TYPES, AlertBannerType } from "./types/AlertBannerType";
import { getDefaultRequiredVal } from "../../helpers/util";

/**
 *
 * Alert Banners taken from BC Gov Design Guide
 * https://developer.gov.bc.ca/Design-System/Alert-Banners
 *
 * Alert banners notify people of important information or changes on a page.
 * Typically, they appear at the top of a page.
 *
 */
export const BcGovAlertBanner = ({
  msg,
  additionalInfo,
  bannerType,
  className,
}: {
  msg: string | JSX.Element;
  additionalInfo?: string | JSX.Element;
  bannerType: AlertBannerType;
  className?: string;
}) => {
  const getBannerIcon = () => {
    switch (bannerType) {
      case ALERT_BANNER_TYPES.INFO:
        return faInfoCircle;
      case ALERT_BANNER_TYPES.SUCCESS:
        return faCheckCircle;
      case ALERT_BANNER_TYPES.WARNING:
        return faExclamationTriangle;
      case ALERT_BANNER_TYPES.ERROR:
      case ALERT_BANNER_TYPES.ERROR_ALT:
      default:
        return faExclamationCircle;
    }
  };

  const ariaLabel = `${bannerType}`;
  const msgId = `${bannerType}-desc`;
  const additionalClassName = getDefaultRequiredVal("", className);

  return (
    <div
      className={`bc-gov-alertbanner bc-gov-alertbanner--${bannerType} ${additionalClassName}`}
      role="alert"
      aria-labelledby={ariaLabel}
      aria-describedby={msgId}
    >
      <FontAwesomeIcon
        className={`bc-gov-alertbanner__icon bc-gov-alertbanner__icon--${bannerType}`}
        icon={getBannerIcon()}
      />

      <div className="bc-gov-alertbanner__info">
        <div className="bc-gov-alertbanner__msg" id={msgId}>
          {msg}
        </div>

        {additionalInfo ? (
          <div className="bc-gov-alertbanner__additional-info">
            {additionalInfo}
          </div>
        ) : null}
      </div>
    </div>
  );
};
