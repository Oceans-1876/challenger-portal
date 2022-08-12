import { lazy } from 'react';

import { withLayout } from './components/Layouts/utils';
import layouts from './components/Layouts';

const routes: { [key: string]: import('react-router-dom').RouteProps } = {
    '/': {
        element: withLayout(
            layouts.Scrollable,
            lazy(() => import('./components/Home'))
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
