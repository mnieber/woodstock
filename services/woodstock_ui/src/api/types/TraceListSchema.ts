import { z } from 'zod';
import { TraceListT } from '/src/api/types/TraceListT';
import { TraceRecordSchema } from '/src/api/types/TraceRecordSchema';

export const TraceListSchema: z.ZodType<TraceListT> = z.object({
  items: z.array(TraceRecordSchema),
});
