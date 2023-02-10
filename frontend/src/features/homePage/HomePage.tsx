import React, { useEffect } from "react";
import Keycloak from "keycloak-js";
// import { AuthenticationService } from './../../authentication/AuthenticationService';

const oidcConfig = {
  // https://dev.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration
  // https://dev.loginproxy.gov.bc.ca/auth/.well-known/openid-configuration
  url: "https://dev.loginproxy.gov.bc.ca/auth",
  realm: "standard",
  clientId: "on-route-bc-4452",
};

const initOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: "S256",
  redirectUri: `https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=${encodeURIComponent(
    'http://localhost:3000/')}`,
  silentCheckSsoRedirectUri:
    window.location.origin + "/silent-check-sso.html",
};

const initKeycloak = async () => {
  const _keycloak = new Keycloak(oidcConfig);
  

  _keycloak.onTokenExpired = () => {
    _keycloak.updateToken(5);
  };

  
  _keycloak
    .init({
      onLoad: "login-required",
      checkLoginIframe: false,
      pkceMethod: "S256",
      redirectUri: `https://logon7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=${encodeURIComponent(
        'http://localhost:3000/')}`,
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      
    })
    .then(() => {
      console.log('initialized');
    })
    .catch((error: any) => {
      console.log('Error in init: ', error);
      
    });
};

export const HomePage = React.memo(() => {
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

    useEffect(() => {      
      initKeycloak();
    }, [initKeycloak]);
  

  return (
    <div style={{ padding: "0px 60px", height: "100vh" }}>
      <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
    </div>
  );
});

HomePage.displayName = "HomePage";
