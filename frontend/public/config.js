/**
 * Inject environment variables into React at runtime.
 *
 * This function is used as a placeholder for env variables.
 *
 * Once deployed, env variables are injected into this function,
 * then they can be accessed in the application.
 *
 * See the following links for reference:
 * https://stackoverflow.developer.gov.bc.ca/questions/143
 * https://javaadpatel.com/building-and-deploying-react-containers/
 *
 * TODO: How to make env variable work in docker compose
 * Currently, the default values shown below are used
 * in the docker compose environment
 */
const envConfig = (() => {
  return {
    VITE_DEPLOY_ENVIRONMENT: "docker",
    VITE_API_VEHICLE_URL: "http://localhost:5010",
    VITE_API_MANAGE_PROFILE_URL: "http://localhost:5010",
    VITE_KEYCLOAK_AUTHORITY: "http://localhost:8080/auth/realms/forms-flow-ai",
    VITE_KEYCLOAK_REALM: "forms-flow-ai",
    VITE_KEYCLOAK_CLIENT_ID: "forms-flow-web",
  };
})();
