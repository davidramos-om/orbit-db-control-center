import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import './index.css'
import App from './App'
import { AppLogProvider } from "src/context/logs-reducer";
import { AppDbProvider } from "src/context/dbs-reducer";
import theme from 'src/theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AppLogProvider>
        <AppDbProvider>
          <Router>
            <App />
          </Router>
        </AppDbProvider>
      </AppLogProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
