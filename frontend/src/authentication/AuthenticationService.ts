import Keycloak from "keycloak-js";

const oidcConfig = {
  // https://dev.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration
  // https://dev.loginproxy.gov.bc.ca/auth/.well-known/openid-configuration
  url: "https://dev.loginproxy.gov.bc.ca/auth",
  realm: "standard",
  clientId: "on-route-bc-4452",
};

const keycloakInstance: Keycloak = new Keycloak(oidcConfig);

const refreshToken = () => {
  setInterval(() => {
    keycloakInstance && keycloakInstance.updateToken(5).then((refreshed)=> {
      console.log('refreshed token after 6 seconds');
    }).catch( (error)=> {
      console.log(error);
    });
  }, 6000);
}

const initOptions = {
  onLoad: "login-required",
  checkLoginIframe: false,
  pkceMethod: "S256",
  redirectUri: 'http://localhost:3000',
  silentCheckSsoRedirectUri:
    window.location.origin + "/silent-check-sso.html",
};

/**
 *
 */
export const AuthenticationService = {
  initializeKeycloak: () => {
    
    keycloakInstance
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: "S256",
        redirectUri: 'http://localhost:3000',
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      })
      .then((authenticated) => {
        console.log("Authenticated::", authenticated);
        refreshToken();
      });
  },
};
