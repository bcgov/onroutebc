import React from 'react';
import { Config } from '../../config';

export const HomePage = React.memo(() => {

  return (
    <div>
      <p>OnRouteBc Home --{DEPLOY_ENV}--</p>
    </div>
  );
});

HomePage.displayName = 'HomePage';