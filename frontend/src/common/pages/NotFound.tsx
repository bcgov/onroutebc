import { Link } from "react-router-dom";

import { ErrorPage } from "../components/error/ErrorPage";
import { HOME } from "../../routes/constants";

export const NotFound = () => {
  return (
    <ErrorPage
      errorTitle="Page not found"
      msgNode={
        <>
          Please visit <Link to={HOME}>onRouteBC</Link>.
        </>
      }
    />
  );
};
