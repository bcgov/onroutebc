import React from 'react';

export const HomePage = React.memo(() => {

  const DEPLOY_ENV = import.meta.env.VITE_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBc Home -{DEPLOY_ENV}-</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';
