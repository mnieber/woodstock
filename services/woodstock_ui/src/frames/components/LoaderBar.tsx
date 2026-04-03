import React from 'react';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

export const LoaderBar: React.FC<PropsT> = (props: PropsT) => {
  return (
    <div
      className={cn(
        'LoaderBar animate-pulse bg-gray-200 rounded',
        props.className
      )}
    />
  );
};
