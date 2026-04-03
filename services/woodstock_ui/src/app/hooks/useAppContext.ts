import * as R from 'ramda';
import React from 'react';
import { AppState } from '/src/app/AppState/AppState';

export const AppContext = React.createContext<any>(null);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContext.Provider');
  }
  return context;
};

export const appCtx = R.mergeAll([
  {
    appState: [useAppContext, 'appState'] as any as AppState,
  },
]);
