import { ErrorPage } from "../components/error/ErrorPage";

export const ClaimProfileUnauthorized = () => {
  return (
    <ErrorPage
      errorTitle="Unauthorized access"
      msgNode={
        <span className="unauthorized-error-msg">
          You do not have the necessary authorization to <br /> view this page.
          Please contact your administrator.
        </span>
      }
    />
  );
};
