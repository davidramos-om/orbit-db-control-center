import './App.css';

import { useRoutes, } from 'react-router-dom';
import { Suspense } from 'react'

import Layout from "src/components/Layout";

import { routes } from "./routes";

const App = () => {

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Layout>
        {useRoutes(routes)}
      </Layout>
    </Suspense>
  );

}

export default App
