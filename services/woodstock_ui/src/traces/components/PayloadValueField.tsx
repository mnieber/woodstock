import React from 'react';

export type PropsT = {
  fieldKey: string;
  value: string;
  className?: any;
};

export const PayloadValueField: React.FC<PropsT> = (props: PropsT) => {
  return (
    <div className="PayloadValueField flex gap-2 text-sm">
      <span className="font-semibold text-gray-700 min-w-[120px]">
        {props.fieldKey}:
      </span>
      <span className="text-gray-900">{props.value}</span>
    </div>
  );
};
