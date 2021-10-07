import { lazy } from 'react';

import { withLayout } from './components/Layouts/utils';
import layouts from './components/Layouts';

const routes: { [key: string]: import('react-router-dom').RouteProps } = {
    '/': {
        exact: true,
        component: withLayout(
            layouts.Scrollable,
            lazy(() => import('./components/Home'))
        )
    },
    '/explore': {
        exact: true,
        component: withLayout(
            layouts.SinglePage,
            lazy(() => import('./components/Explore'))
        )
    }
};

export default routes;
