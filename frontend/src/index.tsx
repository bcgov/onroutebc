import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Styles
import './index.scss';
import '@bcgov/bc-sans/css/BCSans.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
