import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'

// import { Buffer } from 'buffer'
// globalThis.Buffer = Buffer

// import { Buffer as BufferPolyfill } from 'buffer'
// declare var Buffer: typeof BufferPolyfill;
// globalThis.Buffer = BufferPolyfill
// console.log('buffer', Buffer.from('foo', 'hex'))

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
)
