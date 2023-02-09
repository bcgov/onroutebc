import React from "react";
import { useAuth } from "react-oidc-context";
import { Authentication } from "../../common/components/authentication/Authentication";

export const HomePage = () => {
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  // const auth = useAuth();

  // console.log("authauth");

  // if (auth.isAuthenticated) {
  //   return (
  //     <div>XYZ</div>
  //     // <div style={{ padding: "0px 60px", height: "100vh" }}>
  //     //   <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
  //     // </div>
  //   );
  // }

  return (
    <Authentication>
      <div style={{ padding: "0px 60px", height: "100vh" }}>
        <p>OnRouteBC Home -{DEPLOY_ENV}- Environment</p>
      </div>
    </Authentication>
  );

  // return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
};

HomePage.displayName = "HomePage";
