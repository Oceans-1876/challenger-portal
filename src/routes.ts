import { lazy } from 'react';

import { withLayout } from './components/Layouts/utils';
import MainLayout from './components/Layouts/MainLayout';

const routes: { [key: string]: import('react-router-dom').RouteProps } = {
    '/': {
        exact: true,
        component: withLayout(
            MainLayout,
            lazy(() => import('./components/Home'))
        )
    },
    '/explore': {
        exact: true,
        component: withLayout(
            MainLayout,
            lazy(() => import('./components/Explore'))
        )
    }
};

export default routes;
