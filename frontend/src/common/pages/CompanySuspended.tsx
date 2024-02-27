import { ErrorPage } from "../components/error/ErrorPage";
import { PPC_EMAIL, TOLL_FREE_NUMBER } from "../constants/constants";

export const CompanySuspended = () => {
  return (
    <ErrorPage
      errorTitle="Company suspended"
      msgNode={
        <>
          For further assistance please contact the Provincial Permit
            Centre at{" "}
            <span className="contact-info contact-info--toll-free">
            <strong>Toll-free: {TOLL_FREE_NUMBER}</strong>
            </span>{" "}
            or{" "}
            <span className="contact-info contact-info--email">
                <strong>Email: {PPC_EMAIL}</strong>
            </span>
        </>
      }
    />
  );
};
