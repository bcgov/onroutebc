import "./ServiceUnavailable.scss";
import { ErrorPage } from "../components/error/ErrorPage";
import { ONROUTE_WEBPAGE_LINKS } from "../../routes/constants";
import { CustomExternalLink } from "../components/links/CustomExternalLink";

export const ServiceUnavailable = () => {
  return (
    <div className="service-unavailable-error-page">
      <ErrorPage
        errorTitle="Service Currently Unavailable"
        msgNode={
          <div className="service-unavailable-page__msg--top">
            Please visit
            <CustomExternalLink
              className="unexpected-error-msg__link"
              href={ONROUTE_WEBPAGE_LINKS.HOME}
            >
              {ONROUTE_WEBPAGE_LINKS.HOME}
            </CustomExternalLink>
          </div>
        }
        imgSrc="/Error_Service_Unavailable_Graphic.svg"
      />
    </div>
  );
};
