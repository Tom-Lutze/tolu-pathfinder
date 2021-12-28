import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { StoreProvider } from './utils/Store';
import reportWebVitals from './reportWebVitals';
import { SettingsProvider } from './utils/SettingsProvider';

ReactDOM.render(
  // <React.StrictMode>
  <SettingsProvider>
    <StoreProvider>
      <App />
    </StoreProvider>
  </SettingsProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
