import "./WarningBanner.scss";
import { WarningBcGovBanner } from "../../../../../../../../common/components/banners/WarningBcGovBanner";

export const WarningBanner = ({ content }: { content: JSX.Element }) => {
  return (
    <div className="warning-banner">
      <WarningBcGovBanner
        msg={"Review Compliance Requirements"}
        className="warning-banner__header"
      />
      <div className="warning-banner__body">
        <p className="warning-banner__text">{content}</p>
      </div>
    </div>
  );
};
