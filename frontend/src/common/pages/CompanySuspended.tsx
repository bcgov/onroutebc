import "./CompanySuspended.scss";
import { ErrorPage } from "../components/error/ErrorPage";
import { PPC_EMAIL, TOLL_FREE_NUMBER } from "../constants/constants";

export const CompanySuspended = () => {
  return (
    <div className="company-suspended">
      <ErrorPage
        errorTitle="Company suspended"
        msgNode={
          <>
            For further assistance please contact the Provincial Permit
              Centre at{" "}
              <span>
              <strong>Toll-free: {TOLL_FREE_NUMBER}</strong>
              </span>{" "}
              or{" "}
              <span>
                <strong>Email: {PPC_EMAIL}</strong>
              </span>
          </>
        }
      />
    </div>
  );
};
