import { ErrorPage } from "../components/error/ErrorPage";
import { ONROUTE_WEBPAGE_LINKS } from "../../routes/constants";
import { CustomExternalLink } from "../components/links/CustomExternalLink";

export const NotFound = () => {
  return (
    <ErrorPage
      errorTitle="Page not found"
      msgNode={
        <>
          Please visit <CustomExternalLink href={ONROUTE_WEBPAGE_LINKS.HOME}>onRouteBC</CustomExternalLink>.
        </>
      }
    />
  );
};
