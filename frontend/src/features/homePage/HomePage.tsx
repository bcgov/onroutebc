import React from 'react';
import { Config } from '../../config';

export const HomePage = React.memo(() => {

  const DEPLOY_ENV_1 = Config.VITE_DEPLOY_ENVIRONMENT;
  const DEPLOY_ENV_2 = import.meta.env.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBc Home-{DEPLOY_ENV_1}-{DEPLOY_ENV_2}-</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';
