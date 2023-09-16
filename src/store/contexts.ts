/**
 * Various context storage that hold data and functions that can be used by different components.
 * These are accessible in any place in the app that `React.useContext` can be used.
 * For clarity, data and dispatchers (functions that update the state) are store in separate contexts.
 */

import React, { MutableRefObject } from 'react';

import { dataStateInitialValue } from './states';

export const DataStateContext = React.createContext<DataState>(dataStateInitialValue);
export const MapContext = React.createContext<MutableRefObject<maplibregl.Map | null>>({ current: null });
export const MapStateContext = React.createContext<MapState>({ activeBasemap: '' });

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DataActionDispatcherContext = React.createContext<React.Dispatch<DataAction>>(() => {});
export const MapActionDispatcherContext = React.createContext<React.Dispatch<MapAction>>(() => {});
