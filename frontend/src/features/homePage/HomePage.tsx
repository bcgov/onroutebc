import React from 'react';

export const HomePage = React.memo(() => {

  const DEPLOY_ENV: string | undefined =
    process.env.REACT_APP_DEPLOY_ENVIRONMENT;

  return (
    <div>
      <p>OnRouteBc Home -{DEPLOY_ENV}-</p>
    </div>
  );
});