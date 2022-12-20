/*eslint-disable */
const envSettings = window as any;
export class Config {
  static VITE_DEPLOY_ENVIRONMENT = envSettings.env.VITE_DEPLOY_ENVIRONMENT;
}
