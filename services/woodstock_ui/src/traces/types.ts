import { TraceRecordT } from '/src/api/types/TraceRecordT';

export type TraceNodeT = {
  id: string;
  label: string;
  trace?: TraceRecordT;
  children: TraceNodeT[];
  parentNode?: TraceNodeT;
  depth: number;
};

export const createTraceNode = (
  id: string,
  label: string,
  depth: number,
  trace?: TraceRecordT,
  parentNode?: TraceNodeT
): TraceNodeT => {
  return {
    id,
    label,
    trace,
    children: [],
    parentNode,
    depth,
  };
};
