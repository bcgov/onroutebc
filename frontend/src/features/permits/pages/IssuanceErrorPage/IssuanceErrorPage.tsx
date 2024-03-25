import { ErrorPage } from "../../../../common/components/error/ErrorPage";
import { CustomNavLink } from "../../../../common/components/links/CustomNavLink";
import { APPLICATIONS_ROUTES } from "../../../../routes/constants";
import "./IssuanceErrorPage.scss";

export const IssuanceErrorPage = () => {
    return (
      <div className="issuance-error-container">
        <ErrorPage
          errorTitle="Unexpected Error"
          msgNode={
            <>
              <div className="block-1">Your payment was successful.</div>
              <div>
                However, some of your applications weren&#39;t processed. Please go to &nbsp;
                <CustomNavLink to={APPLICATIONS_ROUTES.BASE}>
                  Applications In Progress
                </CustomNavLink>
                  &nbsp; to review your pending permits.
              </div>
            </>
          }
        />
      </div>
    );
  };
  