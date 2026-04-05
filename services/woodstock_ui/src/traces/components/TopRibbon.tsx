import React from 'react';
import { RefreshButton } from '/src/traces/components/RefreshButton';

export type PropsT = {
  className?: any;
};

export const TopRibbon: React.FC<PropsT> = (props: PropsT) => {
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
      <h2 className="text-sm font-semibold text-gray-700">Traces</h2>
      <RefreshButton />
    </div>
  );
};
