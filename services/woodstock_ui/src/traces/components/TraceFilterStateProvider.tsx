import { observer } from 'mobx-react-lite';
import React from 'react';
import { TraceFilterContext } from '/src/traces/hooks/useTraceFilterContext';
import { useTraceFilterState } from '/src/traces/hooks/useTraceFilterState';
import { createGetProps } from '/src/utils/createGetProps';

export type PropsT = React.PropsWithChildren<{}>;

export const TraceFilterStateProvider = observer((props: PropsT) => {
  const { traceFilterState } = useTraceFilterState();

  const getContext = () =>
    createGetProps({
      traceFilterState: () => traceFilterState,
      traceFilterOptions: () => traceFilterState.traceFilterOptions,
      isTraceFilterEnabled: () => traceFilterState.isTraceFilterEnabled,
      setTraceFilterOptions: () =>
        traceFilterState.setTraceFilterOptions.bind(traceFilterState),
      setIsTraceFilterEnabled: () =>
        traceFilterState.setIsTraceFilterEnabled.bind(traceFilterState),
    });

  return (
    <TraceFilterContext.Provider value={getContext()}>
      {props.children}
    </TraceFilterContext.Provider>
  );
});
