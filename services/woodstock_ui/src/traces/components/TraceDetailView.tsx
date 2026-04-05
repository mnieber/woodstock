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
  trace: tracesCtx.trace,
};

export const TraceDetailView = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const trace = props.trace;

    if (!trace) {
      return (
        <div className={cn('TraceDetailView', props.className)}>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 italic">No trace selected</div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn('TraceDetailView h-full flex flex-col bg-gray-50', props.className)}>
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-bold text-gray-900 font-mono">{trace.traceKey}</h1>
            <TraceStateBadge state={trace.traceState} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {trace.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(trace.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Labels Section */}
            {Object.keys(trace.labels).length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Labels</h2>
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  {Object.entries(trace.labels).map(([nodeKey, labels]) => (
                    <div key={nodeKey} className="mb-4 last:mb-0">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 font-mono">{nodeKey}</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(labels).map(([labelKey, labelValue]) => (
                          <span
                            key={labelKey}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                          >
                            <span className="font-medium">{labelKey}:</span>
                            <span className="text-gray-600">{String(labelValue)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Payload Section */}
            <PayloadFieldsView trace={trace} />
          </div>
        </div>
      </div>
    );
  }, ContextProps)
);
