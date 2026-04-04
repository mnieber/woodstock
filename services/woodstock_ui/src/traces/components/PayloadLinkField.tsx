import React from 'react';

export type PropsT = {
  fieldKey: string;
  url: string;
  className?: any;
};

export const PayloadLinkField: React.FC<PropsT> = (props: PropsT) => {
  return (
    <div className="PayloadLinkField flex gap-2 text-sm">
      <span className="font-semibold text-gray-700 min-w-[120px]">
        {props.fieldKey}:
      </span>
      <a
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {props.url}
      </a>
    </div>
  );
};
