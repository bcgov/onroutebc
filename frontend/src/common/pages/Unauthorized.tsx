import { ErrorPage } from "../components/error/ErrorPage";

export const Unauthorized = () => {
  return (
    <ErrorPage
      errorTitle="Unauthorized access"
      msgNode={
        <>
          You do not have the necessary authorization to view this page. Please
          contact your administrator.
        </>
      }
    />
  );
};
