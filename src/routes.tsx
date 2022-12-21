import React, { Suspense, lazy } from 'react';

import { withLayout } from './components/Layouts/utils';
import layouts from './components/Layouts';
import Loading from './components/Loading';

const LazyHome = lazy(() => import('./components/Home'));

/**
 A mapping of routes to `RouteProps`.
 The required property for each route is `element`, which must be a valid React component.

 This mapping is used in `src/app.tsx` to set up all the routes.
 * */
const routes: { [key: string]: import('react-router-dom').RouteProps } = {
    '/': {
        element: (
            <Suspense fallback={<Loading />}>
                <LazyHome />
            </Suspense>
        )
    },
    '/explore': {
        element: withLayout(
            layouts.SinglePage,
            lazy(() => import('./components/Explore'))
        )
    },
    '/species': {
        element: withLayout(
            layouts.Scrollable,
            lazy(() => import('./components/Species'))
        )
    }
};

export default routes;
