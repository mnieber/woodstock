import { z } from 'zod';
import { BlobContentT } from '/src/api/types/BlobContentT';

export const BlobContentSchema: z.ZodType<BlobContentT> = z.object({
  path: z.string(),
  content: z.string(),
});
