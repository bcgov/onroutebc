import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./PaymentFailedBanner.scss";

export const PaymentFailedBanner = () => {
  return (
    <div className="payment-failed-banner">
      <div className="payment-failed-banner__container">
        <div className="payment-failed-banner__icon">
          <FontAwesomeIcon icon={faExclamationCircle} />
        </div>

        <div className="payment-failed-banner__info">
          <div className="payment-failed-banner__title">
            Transaction failed.
          </div>

          <div className="payment-failed-banner__msg">
            There was a problem with your payment. Please try again.
          </div>
        </div>
      </div>
    </div>
  );
};
