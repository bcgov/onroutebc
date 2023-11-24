import { BcGovAlertBanner } from "./BcGovAlertBanner";
import { ALERT_BANNER_TYPES } from "./types/AlertBannerType";

export const InfoBcGovBanner = ({
  msg,
  additionalInfo,
}: {
  msg: string;
  additionalInfo?: JSX.Element;
}) => (
  <BcGovAlertBanner
    msg={msg}
    additionalInfo={additionalInfo}
    bannerType={ALERT_BANNER_TYPES.INFO}
  />
);
