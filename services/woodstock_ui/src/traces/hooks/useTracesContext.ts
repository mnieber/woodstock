import * as R from 'ramda';
import React from 'react';
import { Highlight, Selection } from 'skandha-facets';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { TracesState } from '/src/traces/TracesState';

export const TracesContext = React.createContext<any>(null);

export const useTracesContext = () => {
  const context = React.useContext(TracesContext);
  if (!context) {
    throw new Error(
      'useTracesContext must be used within a TracesContext.Provider'
    );
  }
  return context;
};

export const tracesCtx = R.mergeAll([
  {
    tracesState: [useTracesContext, 'tracesState'] as any as TracesState,
    traces: [useTracesContext, 'traces'] as any as TraceRecordT[],
    trace: [useTracesContext, 'trace'] as any as TraceRecordT,
    tracesHighlight: [useTracesContext, 'tracesHighlight'] as any as Highlight,
    tracesSelection: [useTracesContext, 'tracesSelection'] as any as Selection,
    viewMode: [useTracesContext, 'viewMode'] as any as any,
    filter: [useTracesContext, 'filter'] as any as any,
    applyFilter: [useTracesContext, 'applyFilter'] as any as () => void,
    queryTraces: [useTracesContext, 'queryTraces'] as any as any,
  },
]);
