import { lazy } from "react";
import { RouteObject } from 'react-router-dom';


import HomePage from './pages';
export const NotFoundPage = lazy(() => import('./pages/404'));

export const CounterDbPage = lazy(() => import('./pages/dbs/counter'));
export const DocumentDbPage = lazy(() => import('./pages/dbs/document'));
export const EventLogDbPage = lazy(() => import('./pages/dbs/eventlog'));
export const FeedDbPage = lazy(() => import('./pages/dbs/feed'));
export const KeyValueDbPage = lazy(() => import('./pages/dbs/keyvalue'));

export const PATH = {
    HOME: '/',
    DB: {
        COUNTER: '/db/counter/:id/:name',
        DOCSTORE: '/db/document/:id/:name',
        EVENTLOG: '/db/eventlog/:id/:name',
        FEED: '/db/feed/:id/:name',
        KEYVALUE: '/db/keyvalue/:id/:name',
    },
}

export const routes: RouteObject[] = [
    {
        path: PATH.HOME,
        index: true,
        element: <HomePage />,
    },
    {
        path: PATH.DB.COUNTER,
        index: true,
        element: <CounterDbPage />,
    },
    {
        path: PATH.DB.DOCSTORE,
        index: true,
        element: <DocumentDbPage />,
    },
    {
        path: PATH.DB.EVENTLOG,
        index: true,
        element: <EventLogDbPage />,
    },
    {
        path: PATH.DB.FEED,
        index: true,
        element: <FeedDbPage />,
    },
    {
        path: PATH.DB.KEYVALUE,
        index: true,
        element: <KeyValueDbPage />,
    },
    {
        path: '*',
        index: true,
        element: <NotFoundPage />,
    },
];
