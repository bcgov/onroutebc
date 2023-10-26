import { Link } from "react-router-dom";

import { ErrorPage } from "../components/error/ErrorPage";

export const NotFound = () => {
  return (
    <ErrorPage 
      errorTitle="Page not found"
      msgNode={(
        <>
          Please visit <Link to="/">onRouteBC</Link>.
        </>
      )}
    />
  );
};
