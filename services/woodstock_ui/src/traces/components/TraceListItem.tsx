import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'wouter';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { TraceStateBadge } from '/src/traces/components/TraceStateBadge';

export type PropsT = {
  trace: TraceRecordT;
  url: string;
  className?: any;
};

export const TraceListItem: React.FC<PropsT> = observer((props: PropsT) => {
  return (
    <Link
      href={props.url}
      className={classnames(
        'TraceListItem flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer',
        props.className
      )}
    >
      <TraceStateBadge state={props.trace.traceState} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{props.trace.traceKey}</div>
        <div className="text-xs text-gray-500">
          {props.trace.author} • {new Date(props.trace.timestamp).toLocaleString()}
        </div>
      </div>
    </Link>
  );
});
