import { ErrorPage } from "../components/error/ErrorPage";

export const UniversalUnauthorized = () => {
  return (
    <ErrorPage
      errorTitle="Unauthorized access"
      msgNode={
        <>You do not have the necessary authorization.</>
      }
    />
  );
};
