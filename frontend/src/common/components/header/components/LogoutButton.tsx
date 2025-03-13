/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "react-oidc-context";

import "./LogoutButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export const LogoutButton = () => {
  const { signoutRedirect, removeUser, user } = useAuth();
  const siteMinderLogOffURL =
    import.meta.env.VITE_SITEMINDER_LOG_OFF_URL ||
    envConfig.VITE_SITEMINDER_LOG_OFF_URL;

  return (
    <button
      className="logout-button"
      onClick={() => {
        sessionStorage.removeItem("onRouteBC.user.companyId");
        removeUser();
        signoutRedirect({
          extraQueryParams: {
            post_logout_redirect_uri: `${siteMinderLogOffURL}?retnow=1&returl=${window.location.origin}`,
            id_token_hint: user?.id_token as string,
          },
        });
      }}
    >
      <FontAwesomeIcon
        className="logout-button__icon"
        icon={faArrowRightFromBracket}
      />
      Logout
    </button>
  );
};
