/**
 *  Get the openshift environment name from the url
 * Example:
 * https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca
 * hostname = onroutebc-test-frontend.apps.silver.devops.gov.bc.ca
 * env = ["-test-", "test"]
 * env[1] = "test"
 * */ 
export const getOpenshiftEnv = () => {
  const url = window.location.href;
  const { hostname } = new URL(url);
  const env = hostname.match("-(.*)-");

  if (hostname === "localhost") return "localhost";

  if (env) {
    return env[1];
  }
  return "";
};
