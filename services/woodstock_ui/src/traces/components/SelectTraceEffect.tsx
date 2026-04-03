import { observer } from 'mobx-react-lite';
import * as R from 'ramda';
import React from 'react';
import { withContextProps } from 'react-props-from-context';
import { useParams } from 'wouter';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { useRefUrl } from '/src/routes/hooks/useRefUrl';
import { UrlEffectView } from '/src/utils/components';
import { ObjT } from '/src/utils/types';

type PropsT = {};

const ContextProps = {
  traces: tracesCtx.traces,
  selectedTrace: tracesCtx.selectedTrace,
  tracesSelection: tracesCtx.tracesSelection,
};

export const SelectTraceEffect = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const params = useParams() as ObjT;
    const { updateRefUrl, hasUrlChanged } = useRefUrl();

    const { tracesSelection, selectedTrace, traces } = props;
    // In wouter, wildcard routes use "*" as the param key
    const traceKeyFromUrl = params['*'];
    const traceFromUrl = R.find(
      (x: TraceRecordT) => x.traceKey === traceKeyFromUrl
    )(traces);
    const isTraceInSyncWithUrl = selectedTrace?.traceKey === traceFromUrl?.traceKey;

    const selectTrace = (trace?: TraceRecordT) => {
      tracesSelection.selectItem({ itemId: trace?.traceKey });
    };

    React.useEffect(() => {
      // If there is a new url
      if (hasUrlChanged) {
        if (traceFromUrl) {
          updateRefUrl();
          if (!isTraceInSyncWithUrl) {
            selectTrace(traceFromUrl);
          }
        } else {
          selectTrace(undefined);
        }
      }
    });

    return (
      <UrlEffectView
        resourceName="trace"
        isInSync={isTraceInSyncWithUrl}
        className="absolute"
      />
    );
  }, ContextProps)
);
