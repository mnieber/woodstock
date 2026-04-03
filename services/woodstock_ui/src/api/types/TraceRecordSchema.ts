import { z } from 'zod';
import { TraceRecordT } from '/src/api/types/TraceRecordT';

export const TraceRecordSchema: z.ZodType<TraceRecordT> = z.object({
  traceKey: z.string(),
  traceState: z.union([z.literal('ok'), z.literal('warning'), z.literal('error')]),
  author: z.string(),
  timestamp: z.string(),
  payload: z.record(z.string()),
  labels: z.record(z.record(z.any())),
});
