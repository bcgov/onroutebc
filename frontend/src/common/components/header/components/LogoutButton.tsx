import { useAuth } from "react-oidc-context";

import "./LogoutButton.scss";

export const LogoutButton = () => {
  const { signoutRedirect, user } = useAuth();

  return (
    <a
      className="logout-button"
      onClick={() => {
        sessionStorage.removeItem("onRoutebc.user.context");
        signoutRedirect({
          extraQueryParams: {
            redirect_uri: window.location.origin + "/",
            kc_idp_hint: user?.profile?.identity_provider as string,
          },
        });
      }}
    >
      Log Out
    </a>
  );
};
