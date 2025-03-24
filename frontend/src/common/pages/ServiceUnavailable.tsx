import "./ServiceUnavailable.scss";
import { ErrorPage } from "../components/error/ErrorPage";

export const ServiceUnavailable = () => {
  return (
    <div className="service-unavailable-error-page">
      <ErrorPage
        errorTitle="Service Currently Unavailable"
        msgNode={
          <div className="service-unavailable-page__msg--top">
            Please visit <a href="www.onroute.bc.gov.ca">www.onroute.bc.gov.ca</a>
          </div>
        }
        imgSrc="/Error_Service_Unavailable_Graphic.svg"
      />
    </div>
  );
};
