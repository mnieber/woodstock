import React from 'react';
import { useObservableQuery } from '/src/api/hooks';
import { useDeleteOldTraces } from '/src/api/mutations/useDeleteOldTraces';
import { useQueryTraces } from '/src/api/queries/useQueryTraces';
import { TraceFilterT } from '/src/api/types/TraceFilterT';
import { TracesState } from '/src/traces/TracesState';
import { useBuilder } from '/src/utils/hooks/useBuilder';
import { useGraftResourceStatesFromMemo } from '/src/utils/hooks/useGraftResourceStatesFromMemo';

export type PropsT = {
  filter?: TraceFilterT;
};

export const useTracesState = (props: PropsT) => {
  const graftResourceStatesFromMemo = useGraftResourceStatesFromMemo({});
  const deleteOldTracesMutation = useDeleteOldTraces();

  // Queries
  const queryTraces = useObservableQuery(useQueryTraces(props.filter ?? {}), {
    fetchAsLoad: true,
    debugLabel: 'queryTraces',
  });

  const tracesState = useBuilder(() => {
    const state = new TracesState({
      getTraces: () => {
        const items = graftResourceStatesFromMemo({
          resources: queryTraces.data?.items ?? [],
        });
        return [...items].sort((a, b) =>
          b.timestamp.localeCompare(a.timestamp)
        );
      },
      deleteOldTraces: (olderThanTimestamp: string) => {
        deleteOldTracesMutation.mutateAsync({ olderThanTimestamp });
      },
    });

    return state;
  }) as TracesState;

  React.useEffect(() => () => tracesState.destroy(), [tracesState]);

  return {
    tracesState,
    queryTraces,
    deleteOldTracesMutation,
  };
};
