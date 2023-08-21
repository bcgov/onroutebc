import { useAuth } from "react-oidc-context";

import "./LogoutButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export const LogoutButton = () => {
  const { signoutRedirect, user, removeUser } = useAuth();

  return (
    <button
      className="logout-button"
      onClick={() => {
        sessionStorage.removeItem("onRouteBC.user.companyId");
        removeUser();
        signoutRedirect({
          extraQueryParams: {
            redirect_uri: `https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=${window.location.origin}`,
            kc_idp_hint: user?.profile?.identity_provider as string,
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
