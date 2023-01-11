import React from 'react';

export const HomePage = React.memo(() => {

  const DEPLOY_ENV = import.meta.env.VITE_DEPLOY_ENVIRONMENT || envConfig.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBC Home -{DEPLOY_ENV}-</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';