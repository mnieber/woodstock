import * as R from 'ramda';
import React from 'react';
import { TraceFilterT } from '/src/api/types/TraceFilterT';
import { TraceFilterState } from '/src/traces/TraceFilterState';

export const TraceFilterContext = React.createContext<any>(null);

export const useTraceFilterContext = () => {
  const context = React.useContext(TraceFilterContext);
  if (!context) {
    throw new Error(
      'useTraceFilterContext must be used within a TraceFilterContext.Provider'
    );
  }
  return context;
};

export const traceFilterCtx = R.mergeAll([
  {
    traceFilterState: [
      useTraceFilterContext,
      'traceFilterState',
    ] as any as TraceFilterState,
    traceFilterOptions: [
      useTraceFilterContext,
      'traceFilterOptions',
    ] as any as TraceFilterT,
    isTraceFilterEnabled: [
      useTraceFilterContext,
      'isTraceFilterEnabled',
    ] as any as boolean,
    setTraceFilterOptions: [
      useTraceFilterContext,
      'setTraceFilterOptions',
    ] as any as (options: TraceFilterT) => void,
    setIsTraceFilterEnabled: [
      useTraceFilterContext,
      'setIsTraceFilterEnabled',
    ] as any as (enabled: boolean) => void,
  },
]);
