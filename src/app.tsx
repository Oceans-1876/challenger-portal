import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from './theme';
import routes from './routes';
import Loading from './components/Loading';

const App = (): JSX.Element => (
    <Router>
        <CssBaseline />
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Suspense fallback={<Loading />}>
                    <Switch>
                        {Object.entries(routes).map(([path, props]) => (
                            <Route key={path} path={path} {...props} />
                        ))}
                    </Switch>
                </Suspense>
            </ThemeProvider>
        </StyledEngineProvider>
    </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
