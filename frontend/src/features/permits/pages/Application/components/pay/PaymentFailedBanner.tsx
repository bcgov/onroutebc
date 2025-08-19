import "./PaymentFailedBanner.scss";
import { ErrorBcGovBanner } from "../../../../../../common/components/banners/ErrorBcGovBanner";

export const PaymentFailedBanner = ({
  errorMessage,
}: {
  errorMessage?: string;
}) => {
  return (
    <ErrorBcGovBanner
      className="payment-failed-banner"
      msg="Transaction failed."
      additionalInfo={
        errorMessage ? (
          <div className="payment-failed-banner__msg">{errorMessage}</div>
        ) : (
          <div className="payment-failed-banner__msg">
            There was a problem with your payment. Please try again.
          </div>
        )
      }
    />
  );
};
