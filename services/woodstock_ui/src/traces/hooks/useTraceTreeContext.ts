import * as R from 'ramda';
import { TraceTreeState } from '/src/traces/TraceTreeState/TraceTreeState';
import { useTraceTreeStateContext } from '/src/traces/components/TraceTreeStateProvider';

export const traceTreeCtx = R.mergeAll([
  {
    traceTreeState: [useTraceTreeStateContext, 'traceTreeState'] as any as TraceTreeState,
    nodes: [useTraceTreeStateContext, 'nodes'] as any as any[],
    expansion: [useTraceTreeStateContext, 'expansion'] as any as any,
  },
]);
