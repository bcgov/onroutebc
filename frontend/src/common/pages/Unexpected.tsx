import { ErrorPage } from "../components/error/ErrorPage";
import { ONROUTE_WEBPAGE_LINKS } from "../../routes/constants";
import { CustomExternalLink } from "../components/links/CustomExternalLink";

export const Unexpected = () => {
  return (
    <ErrorPage
      errorTitle="Unexpected Error"
      msgNode={
        <>
          Please refresh to continue. If the error persists, <CustomExternalLink href={ONROUTE_WEBPAGE_LINKS.HOME}>contact us</CustomExternalLink>.
        </>
      }
    />
  );
};
