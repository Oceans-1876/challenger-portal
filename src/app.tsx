import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
        getData<SpeciesProperties[]>('species/', (species) => {
            dataActionDispatcher({ type: 'updateAllSpecies', species });
        });
        getData<StationProperties[]>('stations/', (stations) => {
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
                                <Switch>
                                    {Object.entries(routes).map(([path, props]) => (
                                        <Route key={path} path={path} {...props} />
                                    ))}
                                </Switch>
                            </DataStateContext.Provider>
                        </DataActionDispatcherContext.Provider>
                    </Suspense>
                </ThemeProvider>
            </StyledEngineProvider>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
