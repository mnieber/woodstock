import { useQuery } from '@tanstack/react-query';
import { queryClient } from '/src/api/queryClient';
import { get } from '/src/api/restClient';
import { BlobContentSchema } from '/src/api/types/BlobContentSchema';
import { createQueryKey } from '/src/api/utils/createQueryKey';
import { parseResponse } from '/src/api/utils/parseResponse';
import { waitOnDev } from '/src/utils/wait';

export type FetchBlobArgsT = {
  treePath: string;
};

export type OptionsT = {
  enabled?: boolean;
};

export type FetchBlobQueryKeyT = FetchBlobArgsT;

export function getFetchBlobQueryKey(args: FetchBlobQueryKeyT) {
  return createQueryKey<FetchBlobQueryKeyT>('fetchBlob', args);
}

export const fetchBlobUrl = '/fetch-blob';

export const fetchBlob = (args: FetchBlobArgsT) => {
  const params = new URLSearchParams();
  params.append('tree_path', args.treePath);

  const url = `${fetchBlobUrl}?${params.toString()}`;

  return get(url).then((response) => {
    const res = parseResponse(BlobContentSchema, response.data);
    return waitOnDev(100, res);
  });
};

export const useFetchBlob = (args: FetchBlobArgsT, options?: OptionsT) => {
  return useQuery({
    queryKey: getFetchBlobQueryKey(args),
    queryFn: () => fetchBlob(args),
    enabled: !!(options?.enabled ?? true),
  });
};

export const invalidateFetchBlob = (args: FetchBlobQueryKeyT) => {
  return queryClient.invalidateQueries({
    queryKey: getFetchBlobQueryKey(args),
  });
};
