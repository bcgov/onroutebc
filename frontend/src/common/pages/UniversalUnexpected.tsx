import "./UniversalUnexpected.scss";
// import { ONROUTE_WEBPAGE_LINKS } from "../../routes/constants";
import { ErrorPage } from "../components/error/ErrorPage";
import { CustomExternalLink } from "../components/links/CustomExternalLink";

export const UniversalUnexpected = () => {
  return (
    <ErrorPage
      errorTitle="Unexpected Error"
      msgNode={
        <div className="unexpected-error-msg">
          <span className="unexpected-error-msg__text">
            If this problem persists, please email
          </span>
          <br></br>
          <span className="unexpected-error-msg__text">
            the error reference number below to
          </span>
          <CustomExternalLink className="unexpected-error-msg__link">
            PPCPermit@gov.bc.ca
          </CustomExternalLink>

          <p className="unexpected-error-msg__correlation-id">
            PERMIT-PPC-SEARCH-8ABCU9
          </p>
        </div>
      }
    />
  );
};
