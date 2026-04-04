import React from 'react';
import { useFetchBlob } from '/src/api/queries/useFetchBlob';
import { BlobContentView } from '/src/traces/components/BlobContentView';

export type PropsT = {
  fieldKey: string;
  treePath: string;
  className?: any;
};

export const PayloadTreeField: React.FC<PropsT> = (props: PropsT) => {
  const blobQuery = useFetchBlob({ treePath: props.treePath });

  return (
    <div className="PayloadTreeField space-y-2">
      <div className="text-sm font-semibold text-gray-700">
        {props.fieldKey}:
      </div>

      {blobQuery.isLoading && (
        <div className="text-sm text-gray-500 italic">Loading blob content...</div>
      )}

      {blobQuery.isError && (
        <div className="text-sm text-red-600">
          Error loading blob: {blobQuery.error?.message || 'Unknown error'}
        </div>
      )}

      {blobQuery.isSuccess && blobQuery.data && (
        <BlobContentView blob={blobQuery.data} />
      )}
    </div>
  );
};
