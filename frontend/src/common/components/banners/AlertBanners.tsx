import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import "./AlertBanners.scss";

/**
 *
 * Alert Banners taken from BC Gov Design Guide
 * https://developer.gov.bc.ca/Design-System/Alert-Banners
 *
 * Alert banners notify people of important information or changes on a page.
 * Typically, they appear at the top of a page.
 *
 */

export const ErrorBcGovBanner = ({ description }: { description: string }) => (
  <div
    className="bc-gov-alertbanner bc-gov-alertbanner--error"
    role="alert"
    aria-labelledby="error"
    aria-describedby="error-desc"
  >
    <FontAwesomeIcon
      className="bc-gov-alertbanner__icon bc-gov-alertbanner__icon--error"
      icon={faExclamationCircle}
    />
    <p id="error-desc">{description}</p>
  </div>
);

export const WarningBcGovBanner = ({
  description,
  width,
}: {
  description: string;
  width?: string;
}) => (
  <div
    className="bc-gov-alertbanner bc-gov-alertbanner--warning"
    role="alert"
    aria-labelledby="warning"
    aria-describedby="warning-desc"
    style={{ width: width }}
  >
    <FontAwesomeIcon
      className="bc-gov-alertbanner__icon bc-gov-alertbanner__icon--warning"
      icon={faExclamationTriangle}
    />
    <p id="warning-desc">{description}</p>
  </div>
);

export const InfoBcGovBanner = ({
  description,
  htmlDescription,
  width,
}: {
  description: string;
  htmlDescription?: JSX.Element;
  width?: string;
}) => (
  <div
    className="bc-gov-alertbanner bc-gov-alertbanner--info"
    role="alert"
    aria-labelledby="info"
    aria-describedby="info-desc"
    style={{ width: width }}
  >
    <FontAwesomeIcon
      className="bc-gov-alertbanner__icon bc-gov-alertbanner__icon--info"
      icon={faInfoCircle}
    />
    <p id="info-desc">{description}</p>
    <>{htmlDescription}</>
  </div>
);

export const SuccessBcGovBanner = ({
  description,
}: {
  description: string;
}) => (
  <div
    className="bc-gov-alertbanner bc-gov-alertbanner--success"
    role="alert"
    aria-labelledby="success"
    aria-describedby="success-desc"
  >
    <FontAwesomeIcon
      className="bc-gov-alertbanner__icon bc-gov-alertbanner__icon--success"
      icon={faCheckCircle}
    />
    <p id="success-desc">{description}</p>
  </div>
);
