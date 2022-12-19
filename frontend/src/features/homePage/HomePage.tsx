import React from 'react';
import { Config } from '../../config';

export const HomePage = React.memo(() => {

  const DEPLOY_ENV = Config.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBc Home -{DEPLOY_ENV}-</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';
