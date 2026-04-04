import React from 'react';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { PayloadValueField } from '/src/traces/components/PayloadValueField';
import { PayloadLinkField } from '/src/traces/components/PayloadLinkField';
import { PayloadRefField } from '/src/traces/components/PayloadRefField';
import { parsePayloadField } from '/src/traces/utils/parsePayloadField';

export type PropsT = {
  trace: TraceRecordT;
  className?: any;
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

        if (parsed.type === 'value') {
          return <PayloadValueField key={key} fieldKey={key} value={parsed.content} />;
        }

        if (parsed.type === 'link') {
          return <PayloadLinkField key={key} fieldKey={key} url={parsed.content} />;
        }

        if (parsed.type === 'ref') {
          return <PayloadRefField key={key} fieldKey={key} traceKey={parsed.content} />;
        }

        if (parsed.type === 'tree') {
          // tree:// fields will be implemented in Phase 3
          return (
            <div key={key} className="text-sm text-gray-400">
              {key}: {value} (tree:// - Phase 3)
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
