import { Suspense, lazy } from 'react'
import { useRoutes, } from 'react-router-dom';
import Header from "src/components/Header";

import './App.css'
import { routes } from "./routes";

const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Header>
        {useRoutes(routes)}
      </Header>
    </Suspense>
  );
}


export default App
