import React from 'react';
import { TraceStateT } from '/src/api/types/TraceStateT';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  state: TraceStateT;
  className?: any;
};

const stateColors: Record<TraceStateT, string> = {
  ok: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
};

const stateLabels: Record<TraceStateT, string> = {
  ok: 'OK',
  warning: 'WARN',
  error: 'ERROR',
};

export const TraceStateBadge: React.FC<PropsT> = (props: PropsT) => {
  return (
    <span
      className={cn(
        'TraceStateBadge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        [stateColors[props.state], props.className]
      )}
    >
      {stateLabels[props.state]}
    </span>
  );
};
