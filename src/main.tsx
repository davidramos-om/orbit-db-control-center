import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

// import { Buffer } from 'buffer'
// globalThis.Buffer = Buffer

// import { Buffer as BufferPolyfill } from 'buffer'
// declare var Buffer: typeof BufferPolyfill;
// globalThis.Buffer = BufferPolyfill
// console.log('buffer', Buffer.from('foo', 'hex'))

import './index.css'
import App from './App'
import { AppLogProvider } from "./context/logs-reducer";
import { AppDbProvider } from "./context/dbs-reducer";
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
