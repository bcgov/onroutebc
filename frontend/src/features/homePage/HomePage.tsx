import React from 'react';
import { Config } from '../../config';

export const HomePage = React.memo(() => {

  const DEPLOY_ENV = Config.VITE_DEPLOY_ENVIRONMENT;
  const DEPLOY_ENV2: string | undefined = import.meta.env.VITE_DEPLOY_ENVIRONMENT;
  const DEPLOY_ENV3: string | undefined = import.meta.env.MODE;
  const DEPLOY_ENV4: boolean | undefined = import.meta.env.PROD;
  const DEPLOY_ENV5: boolean | undefined = import.meta.env.DEV;
  const DEPLOY_ENV6: string = process.env.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBc Home - {DEPLOY_ENV} - {DEPLOY_ENV2} - {DEPLOY_ENV3} - {DEPLOY_ENV4} - {DEPLOY_ENV5} - {DEPLOY_ENV6}</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';
