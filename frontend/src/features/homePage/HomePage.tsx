import React from 'react';
import { Config } from '../../config';

export const HomePage = React.memo(() => {

  const DEPLOY_ENV = Config.VITE_DEPLOY_ENVIRONMENT;

  const DEPLOY_ENV2: string | undefined = import.meta.env.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBc Home -{DEPLOY_ENV}-  x{DEPLOY_ENV2}x</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';