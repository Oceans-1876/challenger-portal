import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { theme } from './theme';
import routes from './routes';
import Loading from './components/Loading';

const App = (): JSX.Element => (
    <Container className="fillContainer" disableGutters maxWidth={false}>
        <Suspense fallback={<Loading />}>
            <Switch>
                {Object.entries(routes).map(([path, props]) => (
                    <Route key={path} path={path} {...props} />
                ))}
            </Switch>
        </Suspense>
    </Container>
);

ReactDOM.render(
    <Router>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </StyledEngineProvider>
    </Router>,
    document.getElementById('root')
);
