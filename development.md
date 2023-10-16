# Development guide

This project uses React framework with Typescript.
It uses Webpack to manage module bundles and assets.

## Project structure

All high-level development configurations (e.g. typescript, babel, and eslint) are in their own dedicated files in project root.

The project has a `pre-commit` hook that prevents committing changes that violate typing and linting configs.
To check if the code passes the checks, run `npm run lint` and `npx tsc --noEmit`. Running `npm run lint:fix` will try to fix the issues that can be resolved automatically.

### Webpack

All webpack configs are in `webpack.*.js`.

Some dependencies like `maplibre` are bundled through their own entry in `entry` config to help with chunk size.

Browser polyfills (`src/polyfill.js`), global styling of the app (`src/styles/main.scss`), and global config (`src/config.js`) are loaded directly using their own dedicated entry in webpack.

The HTML entrypoint is `src/index.html`, which is loaded by `webpack-html-plugin`. Any global asset or remote resources (e.g. fonts) can be added here. The transpiled React code is injected into this file by webpack.

`webpack.dev.js` is used with `start` script in `package.json` for development, and `webpack.prod.js` is used with `build` script.

### Code

Description of main files under `src` folder.

| file/folder       | description                                                                                                                                                                                                                                            |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| app.tsx           | The main entrypoint. It sets up the app, routing, default styling and themes, and some localizations.<br/>It also fetches some permanent data that is needed from the API in a `React.useEffect` hook.<br/>The rest of the data are fetches on-demand. |
| routes.tsx        | Contains routes config. This config is used in `app.tsx`                                                                                                                                                                                               |
| store/context.ts  | Uses React Context to store the data describing the state of the app, and functions for updating it.                                                                                                                                                   |
| store/reducers.ts | Reducers are functions that update the state stored in the context with the data received from dispatchers.                                                                                                                                            |
| store/states.ts   | The initial state of the app.                                                                                                                                                                                                                          |
| store/api.ts      | Helper functions to interact with the API.                                                                                                                                                                                                             |
| types/*           | Typescript types                                                                                                                                                                                                                                       |
| components/*      | React components                                                                                                                                                                                                                                       |
