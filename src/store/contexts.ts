import React from 'react';

import { dataStateInitialValue, filtersStateInitialValue } from './states';

export const DataStateContext = React.createContext<DataState>(dataStateInitialValue);
export const FilterStateContext = React.createContext<FilterState>(filtersStateInitialValue);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DataActionDispatcherContext = React.createContext<React.Dispatch<DataAction>>(() => {});
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const FilterActionDispatcherContext = React.createContext<React.Dispatch<FilterAction>>(() => {});
