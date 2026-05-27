import { TraceFilterState } from '/src/traces/TraceFilterState';
import { useBuilder } from '/src/utils/hooks/useBuilder';

export const useTraceFilterState = () => {
  const traceFilterState = useBuilder(
    () => new TraceFilterState()
  ) as TraceFilterState;

  return { traceFilterState };
};
