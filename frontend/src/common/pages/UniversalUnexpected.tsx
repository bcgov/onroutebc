import "./UniversalUnexpected.scss";
import { ONROUTE_WEBPAGE_LINKS } from "../../routes/constants";
import { ErrorPage } from "../components/error/ErrorPage";
import { CustomExternalLink } from "../components/links/CustomExternalLink";

export const UniversalUnexpected = () => {
  return (
    <ErrorPage
      errorTitle="Unexpected Error"
      msgNode={
        <div className="unexpected-error-msg">
          <span className="unexpected-error-msg__text">
            Please return to
          </span>

          <CustomExternalLink
            className="unexpected-error-msg__link"
            href={ONROUTE_WEBPAGE_LINKS.HOME}
          >
            onRouteBC
          </CustomExternalLink>
        </div>
      }
    />
  );
};
