import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import './index.css'
import App from './App'
import { AppLogProvider } from "src/context/LogsContext";
import { AppDbProvider } from "src/context/DBsContext";
import { AppSiteStateProvider } from "src/context/SiteContext";
import theme from 'src/theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AppLogProvider>
        <AppDbProvider>
          <AppSiteStateProvider>
            <Router>
              <App />
            </Router>
          </AppSiteStateProvider>
        </AppDbProvider>
      </AppLogProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
