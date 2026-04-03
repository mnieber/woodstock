import React from 'react';
import { TraceStateT } from '/src/api/types/TraceStateT';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  state: TraceStateT;
  className?: any;
};

const stateColors: Record<TraceStateT, string> = {
  ok: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const stateLabels: Record<TraceStateT, string> = {
  ok: 'OK',
  warning: 'WARN',
  error: 'ERROR',
};

export const TraceStateBadge: React.FC<PropsT> = (props: PropsT) => {
  return (
    <div
      className={cn(
        'TraceStateBadge inline-flex items-center justify-center px-2 py-1 text-xs font-semibold text-white rounded',
        [stateColors[props.state], props.className]
      )}
    >
      {stateLabels[props.state]}
    </div>
  );
};
