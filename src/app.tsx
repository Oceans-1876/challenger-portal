import React, { StrictMode, Suspense } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { getData } from './store/api';
import { DataActionDispatcherContext, DataStateContext } from './store/contexts';
import { dataReducers } from './store/reducers';
import { dataStateInitialValue } from './store/states';
import { theme } from './theme';
import routes from './routes';
import Loading from './components/Loading';

const App = (): JSX.Element => {
    const [dataState, dataActionDispatcher] = React.useReducer(dataReducers, dataStateInitialValue);

    React.useEffect(() => {
        getData<SpeciesSummary[]>(
            'species/all/?order_by=matched_canonical_full_name',
            (species) => {
                dataActionDispatcher({ type: 'updateAllSpecies', species });
            },
            () => undefined
        );
        getData<StationSummary[]>(
            'stations/all/?order_by=order',
            (stations) => {
                dataActionDispatcher({ type: 'updateStations', stations });
            },
            () => undefined
        );
    }, []);

    return (
        <StrictMode>
            <Router>
                <CssBaseline />
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <Suspense fallback={<Loading />}>
                            <DataActionDispatcherContext.Provider value={dataActionDispatcher}>
                                <DataStateContext.Provider value={dataState}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Routes>
                                            {Object.entries(routes).map(([path, props]) => (
                                                <Route key={path} path={path} {...props} />
                                            ))}
                                        </Routes>
                                    </LocalizationProvider>
                                </DataStateContext.Provider>
                            </DataActionDispatcherContext.Provider>
                        </Suspense>
                    </ThemeProvider>
                </StyledEngineProvider>
            </Router>
        </StrictMode>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<App />);
}
