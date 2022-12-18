// vite.config.js / vite.config.ts
	 import { envConfig } from '@geprog/vite-plugin-env-config';

export default {
	  plugins: [envConfig({ variables: ['VITE_DEPLOY_ENVIRONMENT'] })],
};
