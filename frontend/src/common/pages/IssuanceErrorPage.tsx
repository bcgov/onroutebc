import "./IssuanceErrorPage.scss";
import { APPLICATIONS_ROUTES } from "../../routes/constants";
import { ErrorPage } from "../components/error/ErrorPage";
import { CustomNavLink } from "../components/links/CustomNavLink";

export const IssuanceErrorPage = () => {
  return (
    <div className="issuance-error-page">
      <ErrorPage
        errorTitle="Unexpected Error"
        msgNode={
          <>
            <div className="issuance-error-page__msg--top">
              Your payment was successful.
            </div>

            <div className="issuance-error-page__msg--bottom">
              <span className="issuance-error-page__text">
                However, some of your applications weren&apos;t processed. Please go to
              </span>

              <CustomNavLink
                className="issuance-error-page__link"
                to={APPLICATIONS_ROUTES.BASE}
              >
                Applications In Progress
              </CustomNavLink>

              <span className="issuance-error-page__text">
                to review your pending permits.
              </span>
            </div>
          </>
        }
      />
    </div>
  );
};
  