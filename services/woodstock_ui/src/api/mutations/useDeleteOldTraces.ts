import { useObservableMutation } from '/src/api/lib/ObservableMutation';
import { queryClient } from '/src/api/queryClient';
import { post } from '/src/api/restClient';
import { getQueryTracesQueryKey } from '/src/api/queries/useQueryTraces';

export type DeleteOldTracesArgsT = {
  olderThanTimestamp: string; // ISO-8601
};

export const deleteOldTraces = (args: DeleteOldTracesArgsT) => {
  return post('/delete-old-traces', {
    older_than_timestamp: args.olderThanTimestamp,
  });
};

export const useDeleteOldTraces = () => {
  return useObservableMutation({
    mutationFn: deleteOldTraces,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getQueryTracesQueryKey({}) });
    },
  });
};
