import React from 'react';
import { tracesNav } from '/src/traces/routes';

export type PropsT = {
  fieldKey: string;
  traceKey: string;
  className?: any;
};

export const PayloadRefField: React.FC<PropsT> = (props: PropsT) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const routeSpec = tracesNav.trace({ traceKey: props.traceKey });
    routeSpec.nav(routeSpec.url);
  };

  return (
    <div className="PayloadRefField flex gap-2 text-sm">
      <span className="font-semibold text-gray-700 min-w-[120px]">
        {props.fieldKey}:
      </span>
      <a
        href={`/traces/${props.traceKey}`}
        onClick={handleClick}
        className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
      >
        {props.traceKey}
      </a>
    </div>
  );
};
