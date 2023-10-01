import React, { StrictMode, Suspense } from 'react';
// eslint-disable-next-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import axios from 'axios';

import faoAreasUrl from './files/fao_areas.geojson';
import { Feature, MultiPolygon, Polygon } from '@turf/turf';
import { normalizeFaoAreaGeometry } from './components/Map/utils';

window.API_PATH = `${window.API_SERVER}/api/v1`;
window.API_FONTS = `${window.API_SERVER}/fonts`;

const App = (): JSX.Element => {
    const [dataState, dataActionDispatcher] = React.useReducer(dataReducers, dataStateInitialValue);
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(function initialize() {
        axios.get(faoAreasUrl).then((res) => {
            const features = res.data.features as Array<
                Feature<
                    Polygon | MultiPolygon,
                    {
                        F_AREA: string;
                        NAME_EN: string;
                        OCEAN: string;
                    }
                >
            >;
            const data = features
                .map<FAOArea>(({ geometry, properties: { F_AREA, NAME_EN, OCEAN } }) => ({
                    code: Number(F_AREA),
                    name: NAME_EN,
                    ocean: OCEAN,
                    geometry: normalizeFaoAreaGeometry(geometry)
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            dataActionDispatcher({
                type: 'loadFAOAreas',
                faoAreas: data
            });

            Promise.all([
                getData<StationSummary[]>(
                    'stations/all/?order_by=order',
                    (stations) => {
                        dataActionDispatcher({ type: 'loadStations', stations });
                    },
                    console.error
                ),
                getData<SpeciesSummary[]>(
                    'species/all/?order_by=matched_canonical_full_name',
                    (species) => {
                        dataActionDispatcher({ type: 'updateAllSpecies', species });
                    },
                    console.error
                )
            ]).then(() => {
                setInitialized(true);
            });
        }, console.error);
    }, []);

    if (!initialized) return <Loading />;

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
