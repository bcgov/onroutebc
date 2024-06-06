import { ErrorPage } from "../components/error/ErrorPage";

export const UniversalUnauthorized = () => {
  return (
    <ErrorPage
      errorTitle="Unauthorized access"
      msgNode={
        <span className="unauthorized-error-msg">
          You do not have the necessary authorization.
        </span>
      }
    />
  );
};
