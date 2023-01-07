/**
 * Inject environment variables into React at runtime
 * Referenced code from:
 * https://javaadpatel.com/building-and-deploying-react-containers/
 */
export class Config {

  static VITE_DEPLOY_ENVIRONMENT =
    // check for local env vars
    import.meta.env.VITE_DEPLOY_ENVIRONMENT ||
    // check for openshift vars that have been injected at runtime
    (window._env_ && window._env_.VITE_DEPLOY_ENVIRONMENT) ||
    // if there are no local .env or openshift vars, then assume its in a docker compose environment
    "docker";

  static VITE_API_VEHICLE_URL =
    import.meta.env.VITE_API_VEHICLE_URL ||
    (window._env_ && window._env_.VITE_API_VEHICLE_URL) ||
    "http://localhost:5000";
}
