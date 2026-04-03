import { TraceStateT } from '/src/api/types/TraceStateT';

export type TraceFilterT = {
  traceKeyPrefix?: string;
  traceState?: TraceStateT;
  author?: string;
  timeRangeStart?: string;
  timeRangeEnd?: string;
};
