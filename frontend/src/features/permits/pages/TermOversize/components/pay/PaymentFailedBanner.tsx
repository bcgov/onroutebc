import "./PaymentFailedBanner.scss";
import { ErrorBcGovBanner } from "../../../../../../common/components/banners/ErrorBcGovBanner";

export const PaymentFailedBanner = () => {
  return (
    <ErrorBcGovBanner
      className="payment-failed-banner"
      msg="Transaction failed."
      additionalInfo={
        <div className="payment-failed-banner__msg">
          There was a problem with your payment. Please try again.
        </div>
      }
    />
  );
};
