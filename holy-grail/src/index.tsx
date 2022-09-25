import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';

import 'polyfills';
import App from './containers/App/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
