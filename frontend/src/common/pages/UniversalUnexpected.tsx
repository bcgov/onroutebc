import { ONROUTE_WEBPAGE_LINKS } from "../../routes/constants";
import { ErrorPage } from "../components/error/ErrorPage";
import { CustomExternalLink } from "../components/links/CustomExternalLink";

export const UniversalUnexpected = () => {
  return (
    <ErrorPage
      errorTitle="Unexpected Error"
      msgNode={
        <>
          Please return to <CustomExternalLink href={ONROUTE_WEBPAGE_LINKS.HOME}>onRouteBC</CustomExternalLink>
        </>
      }
    />
  );
};
