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
    className="bc-gov-alertbanner bc-gov-alertbanner-error"
    role="alert"
    aria-labelledby="error"
    aria-describedby="error-desc"
  >
    <p id="error-desc">{description}</p>
  </div>
);

export const WarningBcGovBanner = ({
  description,
}: {
  description: string;
}) => (
  <div
    className="bc-gov-alertbanner bc-gov-alertbanner-warning"
    role="alert"
    aria-labelledby="warning"
    aria-describedby="warning-desc"
  >
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
    className="bc-gov-alertbanner bc-gov-alertbanner-info"
    role="alert"
    aria-labelledby="info"
    aria-describedby="info-desc"
    style={{ width: width }}
  >
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
    className="bc-gov-alertbanner bc-gov-alertbanner-success"
    role="alert"
    aria-labelledby="success"
    aria-describedby="success-desc"
  >
    <p id="success-desc">{description}</p>
  </div>
);
