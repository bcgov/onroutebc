export const envConfig = (() => {
  return {
    VITE_DEPLOY_ENVIRONMENT: "docker",
    VITE_API_VEHICLE_URL: "http://localhost:5000",
    VITE_API_MANAGE_PROFILE_URL: "http://localhost:5000",
  };
})();
