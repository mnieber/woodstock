import { TraceStateBadge } from '../components/TraceStateBadge';
import { PayloadField } from '../components/PayloadField';

const mockTrace = {
  key: 'job-123/calc-456/calculation_completed',
  state: 'ok' as const,
  author: 'system',
  timestamp: '2024-01-15T10:32:45Z',
  payload: {
    status: { value: 'completed', type: 'value' as const },
    duration: { value: '155s', type: 'value' as const },
    documentation: { value: 'https://example.com/docs', type: 'link' as const },
    retry_of: { value: 'job-121/calc-456', type: 'ref' as const },
    config: { value: 'config.json', type: 'tree' as const },
    results: { value: 'results.json', type: 'tree' as const },
  },
  labels: {
    'job-123': { active: true },
    'job-123/calc-456': { active: true, priority: 'high' },
  },
};

export default function TraceDetailMockup() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 font-mono">{mockTrace.key}</h1>
            <TraceStateBadge state={mockTrace.state} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 ml-8">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {mockTrace.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(mockTrace.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Payload Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Payload</h2>
            <div className="bg-white rounded-lg border shadow-sm p-6 space-y-1">
              {Object.entries(mockTrace.payload).map(([key, field]) => (
                <PayloadField
                  key={key}
                  fieldKey={key}
                  value={field.value}
                  type={field.type}
                />
              ))}
            </div>
          </section>

          {/* Labels Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Labels</h2>
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {Object.entries(mockTrace.labels).map(([nodeKey, labels]) => (
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

          {/* Blob Content Section (Mock) */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Documents</h2>
            <div className="space-y-4">
              {/* JSON Blob */}
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 font-mono">config.json</h3>
                  <span className="text-xs text-gray-500">tree://job-123/calc-456/config.json</span>
                </div>
                <pre className="p-4 text-xs overflow-x-auto">
                  <code className="text-gray-800">{JSON.stringify({
                    timeout: 300,
                    retries: 3,
                    mode: 'parallel'
                  }, null, 2)}</code>
                </pre>
              </div>

              {/* Markdown Blob */}
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 font-mono">results.md</h3>
                  <span className="text-xs text-gray-500">tree://job-123/calc-456/results.md</span>
                </div>
                <div className="p-4 prose prose-sm max-w-none">
                  <h4>Calculation Results</h4>
                  <p>The calculation completed successfully with the following metrics:</p>
                  <ul>
                    <li>Total items processed: 1,234</li>
                    <li>Success rate: 99.2%</li>
                    <li>Average processing time: 125ms</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
