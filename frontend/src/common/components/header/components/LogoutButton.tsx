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
        sessionStorage.removeItem("onRoutebcP.user.context");
        removeUser();
        signoutRedirect({
          extraQueryParams: {
            redirect_uri: window.location.origin + "/",
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
