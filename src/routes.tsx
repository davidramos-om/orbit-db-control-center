import { lazy } from "react";
import { RouteObject } from 'react-router-dom';


import HomePage from './pages';

// export const HomePage = lazy(() => import('./pages/index'))
export const AboutPage = lazy(() => import('./pages/about'))
export const BlogPage = lazy(() => import('./pages/blog'))
export const NotFoundPage = lazy(() => import('./pages/404'))


export const routes: RouteObject[] = [
    {
        path: '/',
        index: true,
        element: <HomePage />,
    },
    {
        path: 'about',
        index: true,
        element: <AboutPage />,
    },
    {
        path: 'blog',
        index: true,
        element: <BlogPage />,
    },
    {
        path: '*',
        index: true,
        element: <NotFoundPage />,
    },
];
