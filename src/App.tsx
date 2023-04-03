import './App.css';

import { useRoutes, } from 'react-router-dom';
import { Suspense, useCallback, useEffect } from 'react'

import Layout from "src/components/Layout";
import { getAllPrograms } from "./lib/manage-programs";
import { useAppDbDispatch } from "src/context/dbs-reducer";

import { routes } from "./routes";
import { MapOrbitDbEntry } from "./lib/mapper";

const App = () => {

  const dispatch = useAppDbDispatch();

  const getDbs = useCallback(async () => {
    const dbs = await getAllPrograms();
    const entries = dbs.map((db: any) => { return MapOrbitDbEntry(db) });
    dispatch({
      type: 'init',
      dbs: entries,
    });

  }, [ dispatch ]);

  useEffect(() => {
    getDbs();
  }, [ getDbs ]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Layout>
        {useRoutes(routes)}
      </Layout>
    </Suspense>
  );

}

export default App
