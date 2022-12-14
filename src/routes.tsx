import React, { Suspense, lazy } from 'react';

import { withLayout } from './components/Layouts/utils';
import layouts from './components/Layouts';
import Loading from './components/Loading';

const LazyHome = lazy(() => import('./components/Home'));

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
