import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import maplibre from 'maplibre-gl';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { getData } from './store/api';
import { DataActionDispatcherContext, DataStateContext } from './store/contexts';
import { dataReducers } from './store/reducers';
import { dataStateInitialValue } from './store/states';
import { theme } from './theme';
import routes from './routes';
import Loading from './components/Loading';

maplibre.accessToken = MAPBOX_TOKEN || '';

const App = (): JSX.Element => {
    const [dataState, dataActionDispatcher] = React.useReducer(dataReducers, dataStateInitialValue);

    React.useEffect(() => {
        getData<SpeciesSummary[]>('species/all/?order_by=matched_canonical_full_name', (species) => {
            dataActionDispatcher({ type: 'updateAllSpecies', species });
        });
        getData<StationSummary[]>('stations/all/?order_by=order', (stations) => {
            dataActionDispatcher({ type: 'updateStations', stations });
        });
    }, []);

    return (
        <Router>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <Suspense fallback={<Loading />}>
                        <DataActionDispatcherContext.Provider value={dataActionDispatcher}>
                            <DataStateContext.Provider value={dataState}>
                                <Routes>
                                    {Object.entries(routes).map(([path, props]) => (
                                        <Route key={path} path={path} {...props} />
                                    ))}
                                </Routes>
                            </DataStateContext.Provider>
                        </DataActionDispatcherContext.Provider>
                    </Suspense>
                </ThemeProvider>
            </StyledEngineProvider>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
