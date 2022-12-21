/**
 * Various context storage that hold data and functions that can be used by different components.
 * These are accessible in any place in the app that `React.useContext` can be used.
 * For clarity, data and dispatchers (functions that update the state) are store in separate contexts.
 */

import React from 'react';

import { dataStateInitialValue, filtersStateInitialValue } from './states';

export const DataStateContext = React.createContext<DataState>(dataStateInitialValue);
export const FilterStateContext = React.createContext<FilterState>(filtersStateInitialValue);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DataActionDispatcherContext = React.createContext<React.Dispatch<DataAction>>(() => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const FilterActionDispatcherContext = React.createContext<React.Dispatch<FilterAction>>(() => {});
