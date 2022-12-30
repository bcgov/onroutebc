/**
 *  Get the openshift environment name from the url
 * Example:
 * https://onroutebc-test-frontend.apps.silver.devops.gov.bc.ca
 * hostname = onroutebc-test-frontend.apps.silver.devops.gov.bc.ca
 * env = ["-test-", "test"]
 * env[1] = "test"
 * */ 
export const getOpenshiftEnv = () => {
  console.log("Test getOpenshiftEnv");
  const url = window.location.href;
  const { hostname } = new URL(url);
  const env = hostname.match("-(.*)-");

  if (hostname === "localhost") return "localhost";

  if (env) {
    // If the environment is a number then it is in the dev environment
    // The number corresponds to the PR in github
    /*
    if (!isNaN(Number(env[1]))) {
      return "dev";
    }
    */
    // If isNaN, then it should be 'test', 'prod', or 'uat'
    return env[1];
  }
  return "other";
};
