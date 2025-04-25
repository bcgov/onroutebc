import "./UniversalUnexpected.scss";
import { ErrorPage } from "../components/error/ErrorPage";
import { CustomExternalLink } from "../components/links/CustomExternalLink";

export const VersionMismatchErrorPage = () => {
  return (
    <ErrorPage
      errorTitle="Unexpected Error"
      msgNode={
        <div className="unexpected-error-msg">
          <span className="unexpected-error-msg__text">
            Please try reloading the browser. If the error
          </span>
          <br></br>
          <span className="unexpected-error-msg__text">
            persists, please email the error reference number
          </span>
          <br></br>
          <span className="unexpected-error-msg__text">
            below to
            <CustomExternalLink className="unexpected-error-msg__link">
              PPCPermit@gov.bc.ca
            </CustomExternalLink>
          </span>
        </div>
      }
    />
  );
};
