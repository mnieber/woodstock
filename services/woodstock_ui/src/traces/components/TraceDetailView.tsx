import { observer } from 'mobx-react-lite';
import { withContextProps } from 'react-props-from-context';
import { PayloadFieldsView } from '/src/traces/components/PayloadFieldsView';
import { TraceStateBadge } from '/src/traces/components/TraceStateBadge';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  selectedTrace: tracesCtx.selectedTrace,
};

export const TraceDetailView = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const trace = props.selectedTrace;

    if (!trace) {
      return (
        <div className={cn('TraceDetailView p-6', props.className)}>
          <div className="text-gray-500 italic">No trace selected</div>
        </div>
      );
    }

    return (
      <div className={cn('TraceDetailView p-6 space-y-6', props.className)}>
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <TraceStateBadge state={trace.traceState} />
            <h2 className="text-lg font-semibold">{trace.traceKey}</h2>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">Author:</span> {trace.author}
            <span className="mx-2">•</span>
            <span className="font-medium">Timestamp:</span>{' '}
            {new Date(trace.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Labels Section */}
        {Object.keys(trace.labels).length > 0 && (
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-gray-700">Labels</h3>
            <div className="bg-gray-50 rounded p-4 space-y-2">
              {Object.entries(trace.labels).map(([nodeKey, labels]) => (
                <div key={nodeKey} className="space-y-1">
                  <div className="text-xs font-semibold text-gray-600">{nodeKey}</div>
                  <div className="pl-4 space-y-1">
                    {Object.entries(labels).map(([key, value]) => (
                      <div key={key} className="flex gap-2 text-sm">
                        <span className="font-semibold text-gray-700">{key}:</span>
                        <span className="text-gray-900">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payload Section */}
        <div className="space-y-2">
          <h3 className="text-md font-semibold text-gray-700">Payload</h3>
          <div className="bg-gray-50 rounded p-4">
            <PayloadFieldsView trace={trace} />
          </div>
        </div>
      </div>
    );
  }, ContextProps)
);
