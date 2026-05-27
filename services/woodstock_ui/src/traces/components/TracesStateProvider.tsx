import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { updateSources } from 'mobx-resource-states';
import { withContextProps } from 'react-props-from-context';
import React from 'react';
import { isQueryLoading } from '/src/api/lib/ObservableQuery';
import { traceFilterCtx } from '/src/traces/hooks/useTraceFilterContext';
import { TracesContext } from '/src/traces/hooks/useTracesContext';
import { useTracesState } from '/src/traces/hooks/useTracesState';
import { createGetProps } from '/src/utils/createGetProps';
import { useBuilder } from '/src/utils/hooks/useBuilder';

export type PropsT = React.PropsWithChildren<{}>;

const ContextProps = {
  traceFilterOptions: traceFilterCtx.traceFilterOptions,
};

export const TracesStateProvider = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const { tracesState, queryTraces } = useTracesState({
      filter: props.traceFilterOptions,
    });

    const cache = useBuilder(() =>
      makeAutoObservable({
        get traces() {
          return updateSources(
            { resource: tracesState.tracesCtr.data.traces },
            ['loading', () => isQueryLoading(queryTraces), 'queryTraces']
          );
        },
        get trace() {
          return updateSources(
            {
              resource: tracesState.tracesCtr.highlight.item,
              resourceName: 'trace',
            },
            ['loading', () => isQueryLoading(queryTraces), 'trace']
          );
        },
      })
    );

    const getTracesContext = () => {
      return createGetProps({
        tracesState: () => tracesState,
        traces: () => cache.traces,
        trace: () => cache.trace,
        tracesHighlight: () => tracesState.tracesCtr.highlight,
        tracesSelection: () => tracesState.tracesCtr.selection,
        viewMode: () => tracesState.tracesCtr.viewMode,
        queryTraces: () => queryTraces,
      });
    };

    return (
      <TracesContext.Provider value={getTracesContext()}>
        {props.children}
      </TracesContext.Provider>
    );
  }, ContextProps)
);
