import React from 'react';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { PayloadValueField } from '/src/traces/components/PayloadValueField';

export type PropsT = {
  trace: TraceRecordT;
  className?: any;
};

type PayloadFieldType = 'value' | 'link' | 'ref' | 'tree';

const parsePayloadField = (
  value: string
): { type: PayloadFieldType; content: string } => {
  if (value.startsWith('value://')) {
    return { type: 'value', content: value.substring('value://'.length) };
  }
  if (value.startsWith('link://')) {
    return { type: 'link', content: value.substring('link://'.length) };
  }
  if (value.startsWith('ref://')) {
    return { type: 'ref', content: value.substring('ref://'.length) };
  }
  if (value.startsWith('tree://')) {
    return { type: 'tree', content: value.substring('tree://'.length) };
  }
  return { type: 'value', content: value };
};

export const PayloadFieldsView: React.FC<PropsT> = (props: PropsT) => {
  const payloadEntries = Object.entries(props.trace.payload);

  if (payloadEntries.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">No payload fields</div>
    );
  }

  return (
    <div className="PayloadFieldsView space-y-2">
      {payloadEntries.map(([key, value]) => {
        const parsed = parsePayloadField(value);

        // For Phase 1, only render value:// fields
        if (parsed.type === 'value') {
          return <PayloadValueField key={key} fieldKey={key} value={parsed.content} />;
        }

        // For other types, show placeholder
        return (
          <div key={key} className="text-sm text-gray-400">
            {key}: {value} (type: {parsed.type} - not yet implemented)
          </div>
        );
      })}
    </div>
  );
};
