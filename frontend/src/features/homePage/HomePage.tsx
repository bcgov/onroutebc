import React from 'react';
import loadEnv from 'vite'

export const HomePage = React.memo(() => {

  const DEPLOY_ENV1 = import.meta.env.VITE_DEPLOY_ENVIRONMENT;
  const DEPLOY_ENV2 = process.env.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBc Home-{DEPLOY_ENV1}-{DEPLOY_ENV2}-</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';
