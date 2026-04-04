import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { updateSources } from 'mobx-resource-states';
import React from 'react';
import { isQueryLoading } from '/src/api/lib/ObservableQuery';
import { TracesContext } from '/src/traces/hooks/useTracesContext';
import { useTracesState } from '/src/traces/hooks/useTracesState';
import { createGetProps } from '/src/utils/createGetProps';
import { useBuilder } from '/src/utils/hooks/useBuilder';

export type PropsT = React.PropsWithChildren<{}>;

export const TracesStateProvider = observer((props: PropsT) => {
  // Create a memoized filter object that updates when filter facet changes
  const [filterForQuery, setFilterForQuery] = React.useState({});

  const { tracesState, queryTraces } = useTracesState({ filter: filterForQuery });

  const cache = useBuilder(() =>
    makeAutoObservable({
      get traces() {
        return updateSources(
          { resource: tracesState.tracesCtr.data.traces },
          ['loading', () => isQueryLoading(queryTraces), 'queryTraces']
        );
      },
      get selectedTrace() {
        const selectedTraces = tracesState.tracesCtr.selection.items;
        return updateSources(
          {
            resource: selectedTraces.length > 0 ? selectedTraces[0] : undefined,
            resourceName: 'selectedTrace',
          },
          ['loading', () => isQueryLoading(queryTraces), 'selectedTrace']
        );
      },
    })
  );

  const getTracesContext = () => {
    return createGetProps({
      tracesState: () => tracesState,
      traces: () => cache.traces,
      selectedTrace: () => cache.selectedTrace,
      selectedTraceKey: () => {
        const selectedTraces = tracesState.tracesCtr.selection.items;
        return selectedTraces.length > 0 ? selectedTraces[0].traceKey : null;
      },
      selectTrace: (traceKey: string) => {
        const trace = cache.traces.find((t: any) => t.traceKey === traceKey);
        if (trace) {
          tracesState.tracesCtr.selection.selectItem({ itemId: trace.traceKey });
        }
      },
      tracesSelection: () => tracesState.tracesCtr.selection,
      viewMode: () => tracesState.tracesCtr.viewMode,
      filter: () => tracesState.tracesCtr.filter,
      applyFilter: () => {
        setFilterForQuery(tracesState.tracesCtr.filter.asFilterObject);
      },
      queryTraces: () => queryTraces,
    });
  };

  return (
    <TracesContext.Provider value={getTracesContext()}>
      {props.children}
    </TracesContext.Provider>
  );
});
