import './App.css';

import { useRoutes, } from 'react-router-dom';
import { Suspense, useEffect } from 'react'

import Layout from "src/components/Layout";
import { getAllDatabases } from "src/lib/db";
import { useAppDbDispatch } from "src/context/dbs-reducer";

import { routes } from "./routes";
import { MapOrbitDbEntry } from "./lib/mapper";

const App = () => {

  const dispatch = useAppDbDispatch();

  useEffect(() => {
    getDbs();
  }, []);

  const getDbs = async () => {

    const dbs = await getAllDatabases();
    const entries = dbs.map((db: any) => { return MapOrbitDbEntry(db) });
    dispatch({
      type: 'init',
      dbs: entries,
    });
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Layout>
        {useRoutes(routes)}
      </Layout>
    </Suspense>
  );

}

export default App
