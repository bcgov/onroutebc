import React from 'react';
import { Config } from '../../config';
import { getEnvConfig } from '@geprog/vite-plugin-env-config';

const DEPLOY_ENV = getEnvConfig('VITE_DEPLOY_ENVIRONMENT');

export const HomePage = React.memo(() => {
  return (
    <div>
      <p>OnRouteBc Home -{DEPLOY_ENV}-</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';
