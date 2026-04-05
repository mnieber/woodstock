import React from 'react';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { PayloadValueField } from '/src/traces/components/PayloadValueField';
import { PayloadLinkField } from '/src/traces/components/PayloadLinkField';
import { PayloadRefField } from '/src/traces/components/PayloadRefField';
import { PayloadTreeField } from '/src/traces/components/PayloadTreeField';
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

  // Group fields by type
  const valueFields: Array<[string, any]> = [];
  const linkFields: Array<[string, any]> = [];
  const refFields: Array<[string, any]> = [];
  const treeFields: Array<[string, any]> = [];

  payloadEntries.forEach(([key, value]) => {
    const parsed = parsePayloadField(value);
    if (parsed.type === 'value') {
      valueFields.push([key, parsed.content]);
    } else if (parsed.type === 'link') {
      linkFields.push([key, parsed.content]);
    } else if (parsed.type === 'ref') {
      refFields.push([key, parsed.content]);
    } else if (parsed.type === 'tree') {
      treeFields.push([key, parsed.content]);
    }
  });

  return (
    <div className="PayloadFieldsView space-y-6">
      {/* Values Section */}
      {valueFields.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Values</h2>
          <div className="bg-white rounded-lg border shadow-sm p-6 space-y-1">
            {valueFields.map(([key, value]) => (
              <PayloadValueField key={key} fieldKey={key} value={value} />
            ))}
          </div>
        </section>
      )}

      {/* Links Section */}
      {(linkFields.length > 0 || refFields.length > 0) && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Links</h2>
          <div className="bg-white rounded-lg border shadow-sm p-6 space-y-1">
            {linkFields.map(([key, url]) => (
              <PayloadLinkField key={key} fieldKey={key} url={url} />
            ))}
            {refFields.map(([key, traceKey]) => (
              <PayloadRefField key={key} fieldKey={key} traceKey={traceKey} />
            ))}
          </div>
        </section>
      )}

      {/* Documents Section */}
      {treeFields.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Documents</h2>
          <div className="space-y-4">
            {treeFields.map(([key, treePath]) => (
              <PayloadTreeField key={key} fieldKey={key} treePath={treePath} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
