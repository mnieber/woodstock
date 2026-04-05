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
        'TraceListItem p-4 hover:bg-gray-50 cursor-pointer transition-colors grid grid-cols-12 gap-4 items-center border-b last:border-b-0',
        props.className
      )}
    >
      <div className="col-span-6 flex items-center gap-2">
        <span className="font-mono text-sm font-medium text-gray-900 truncate">
          {props.trace.traceKey}
        </span>
      </div>
      <div className="col-span-2 text-xs text-gray-500 truncate">
        {props.trace.author}
      </div>
      <div className="col-span-3 text-xs text-gray-500">
        {new Date(props.trace.timestamp).toLocaleString()}
      </div>
      <div className="col-span-1 flex justify-end">
        <TraceStateBadge state={props.trace.traceState} />
      </div>
    </Link>
  );
});
