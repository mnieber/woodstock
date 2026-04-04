import React from 'react';
import { observer } from 'mobx-react-lite';
import { withContextProps } from 'react-props-from-context';
import { createGetProps } from '/src/utils/createGetProps';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { useTraceTreeState } from '/src/traces/hooks/useTraceTreeState';

export type PropsT = {
  children: React.ReactNode;
};

const ContextProps = {
  traces: tracesCtx.traces,
};

const TraceTreeContext = React.createContext<any>(null);

export const TraceTreeStateProvider = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const { traceTreeState } = useTraceTreeState({
      getTraces: () => props.traces,
    });

    const getTraceTreeContext = () => {
      return createGetProps({
        traceTreeState: () => traceTreeState,
        nodes: () => traceTreeState.nodesCtr.data.nodes,
        expansion: () => traceTreeState.nodesCtr.expansion,
      });
    };

    return (
      <TraceTreeContext.Provider value={getTraceTreeContext()}>
        {props.children}
      </TraceTreeContext.Provider>
    );
  }, ContextProps)
);

export const useTraceTreeStateContext = () => {
  const ctx = React.useContext(TraceTreeContext);
  if (!ctx) {
    throw new Error(
      'useTraceTreeStateContext must be used within TraceTreeStateProvider'
    );
  }
  return ctx;
};
