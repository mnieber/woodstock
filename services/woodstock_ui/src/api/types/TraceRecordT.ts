import { initRS } from 'mobx-resource-states';
import { TraceStateT } from '/src/api/types/TraceStateT';
import { ObjT } from '/src/utils/types';

export type TraceRecordT = {
  traceKey: string;
  traceState: TraceStateT;
  author: string;
  timestamp: string;
  payload: { [key: string]: string };
  labels: { [key: string]: { [key: string]: any } };
};

export const createTraceRecord = (values: ObjT): TraceRecordT => {
  return initRS({
    traceKey: values.traceKey ?? '',
    traceState: values.traceState ?? 'ok',
    author: values.author ?? '',
    timestamp: values.timestamp ?? new Date().toISOString(),
    payload: values.payload ?? {},
    labels: values.labels ?? {},
  } as TraceRecordT);
};
