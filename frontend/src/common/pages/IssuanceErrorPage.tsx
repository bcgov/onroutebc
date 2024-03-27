
import { APPLICATIONS_ROUTES } from "../../routes/constants";
import { ErrorPage } from "../components/error/ErrorPage";
import { CustomNavLink } from "../components/links/CustomNavLink";
import "./IssuanceErrorPage.scss";

export const IssuanceErrorPage = () => {
    return (
      <div className="issuance-error-page">
        <ErrorPage
          errorTitle="Unexpected Error"
          msgNode={
            <>
              <span className="issuance-error-page__msg--top">Your payment was successful.</span>
              <span className="issuance-error-page__msg--bottom">
                However, some of your applications weren&#39;t processed. Please go to {" "}
                <CustomNavLink to={APPLICATIONS_ROUTES.BASE}>
                  Applications In Progress
                </CustomNavLink>
                  {" "} to review your pending permits.
              </span>
            </>
          }
        />
      </div>
    );
  };
  