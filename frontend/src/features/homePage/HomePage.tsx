import { Authentication } from "../../common/components/authentication/Authentication";

export const HomePage = () => {
  const DEPLOY_ENV =
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <Authentication>
      <div style={{ padding: "0px 60px" }}>
        <p>Home -{DEPLOY_ENV}- Environment</p>
      </div>
    </Authentication>
  );
};

HomePage.displayName = "HomePage";
