import "./CompanySuspended.scss";
import { ErrorPage } from "../components/error/ErrorPage";
import { PPC_EMAIL, TOLL_FREE_NUMBER } from "../constants/constants";

export const CompanySuspended = () => {
  return (
    <div className="company-suspended">
      <ErrorPage
        errorTitle="Company Access Restricted"
        msgNode={
          <div className="company-suspended__msg">
            <span className="company-suspended__text">
              For further assistance please contact the Provincial Permit
              Centre at
            </span>
            
            <span
              className="company-suspended__contact company-suspended__contact--toll"
            >
              Toll-free: {TOLL_FREE_NUMBER}
            </span>

            <span className="company-suspended__text">or</span>

            <span
              className="company-suspended__contact company-suspended__contact--email"
            >
              Email: {PPC_EMAIL}
            </span>
          </div>
        }
      />
    </div>
  );
};
