import React from 'react';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { TraceTreeState } from '/src/traces/TraceTreeState/TraceTreeState';
import { useBuilder } from '/src/utils/hooks/useBuilder';

export type PropsT = {
  getTraces: () => TraceRecordT[];
};

export const useTraceTreeState = (props: PropsT) => {
  const traceTreeState = useBuilder(() => {
    const state = new TraceTreeState({
      getTraces: () => props.getTraces(),
    });

    return state;
  }) as TraceTreeState;

  React.useEffect(() => () => traceTreeState.destroy(), [traceTreeState]);

  return {
    traceTreeState,
  };
};
