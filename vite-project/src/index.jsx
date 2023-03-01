import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import { AppProvider } from './context/AppContext';
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Main />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);