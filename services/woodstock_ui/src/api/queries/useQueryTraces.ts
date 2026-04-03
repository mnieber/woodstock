import { useQuery } from '@tanstack/react-query';
import { queryClient } from '/src/api/queryClient';
import { get } from '/src/api/restClient';
import { TraceFilterT } from '/src/api/types/TraceFilterT';
import { TraceListSchema } from '/src/api/types/TraceListSchema';
import { createQueryKey } from '/src/api/utils/createQueryKey';
import { parseResponse } from '/src/api/utils/parseResponse';
import { waitOnDev } from '/src/utils/wait';

export type QueryTracesArgsT = TraceFilterT;

export type OptionsT = {
  enabled?: boolean;
};

export type QueryTracesQueryKeyT = QueryTracesArgsT;

export function getQueryTracesQueryKey(args: QueryTracesQueryKeyT) {
  return createQueryKey<QueryTracesQueryKeyT>('queryTraces', args);
}

export const queryTracesUrl = '/query-traces';

export const queryTraces = (args: QueryTracesArgsT) => {
  const params = new URLSearchParams();

  if (args.traceKeyPrefix) {
    params.append('trace_key_prefix', args.traceKeyPrefix);
  }
  if (args.traceState) {
    params.append('trace_state', args.traceState);
  }
  if (args.author) {
    params.append('author', args.author);
  }
  if (args.timeRangeStart) {
    params.append('time_range_start', args.timeRangeStart);
  }
  if (args.timeRangeEnd) {
    params.append('time_range_end', args.timeRangeEnd);
  }

  const url = params.toString()
    ? `${queryTracesUrl}?${params.toString()}`
    : queryTracesUrl;

  return get(url).then((response) => {
    const res = parseResponse(TraceListSchema, response.data);
    return waitOnDev(100, res);
  });
};

export const useQueryTraces = (args: QueryTracesArgsT, options?: OptionsT) => {
  return useQuery({
    queryKey: getQueryTracesQueryKey(args),
    queryFn: () => queryTraces(args),
    enabled: !!(options?.enabled ?? true),
  });
};

export const invalidateQueryTraces = (args: QueryTracesQueryKeyT) => {
  return queryClient.invalidateQueries({
    queryKey: getQueryTracesQueryKey(args),
  });
};
