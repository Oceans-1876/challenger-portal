import React from 'react';

import { dataStateInitialValue } from './states';

export const DataStateContext = React.createContext<DataState>(dataStateInitialValue);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DataActionDispatcherContext = React.createContext<React.Dispatch<DataAction>>(() => {});
