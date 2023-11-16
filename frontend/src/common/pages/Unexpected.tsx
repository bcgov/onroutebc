import { Link } from "react-router-dom";

import { ErrorPage } from "../components/error/ErrorPage";
import { HOME } from "../../routes/constants";

export const Unexpected = () => {
  return (
    <ErrorPage
      errorTitle="Unexpected Error"
      msgNode={
        <>
          Please refresh to continue. If the error persists, <Link to={HOME}>contact us</Link>.
        </>
      }
    />
  );
};
