import { BcGovAlertBanner } from "./BcGovAlertBanner";
import { ALERT_BANNER_TYPES } from "./types/AlertBannerType";

export const ErrorAltBcGovBanner = ({
  msg,
  additionalInfo,
  className,
}: {
  msg: string | JSX.Element;
  additionalInfo?: string | JSX.Element;
  className?: string;
}) => (
  <BcGovAlertBanner
    msg={msg}
    additionalInfo={additionalInfo}
    bannerType={ALERT_BANNER_TYPES.ERROR_ALT}
    className={className}
  />
);
