import { useState } from 'react';
import { TraceStateBadge } from '../components/TraceStateBadge';
import { RefreshButton } from '../components/RefreshButton';
import { PayloadField } from '../components/PayloadField';

const mockTraces = [
  {
    key: 'job-123',
    state: 'ok' as const,
    author: 'system',
    timestamp: '2024-01-15T10:30:00Z',
    hasChildren: true,
    isExpanded: true,
    payload: {},
    labels: {},
  },
  {
    key: 'job-123/calc-456',
    state: 'ok' as const,
    author: 'system',
    timestamp: '2024-01-15T10:30:05Z',
    hasChildren: true,
    isExpanded: true,
    payload: {
      status: { value: 'completed', type: 'value' as const },
      duration: { value: '155s', type: 'value' as const },
    },
    labels: {
      'job-123': { active: true },
      'job-123/calc-456': { active: true, priority: 'high' },
    },
  },
  {
    key: 'job-123/calc-456/calculation_started',
    state: 'ok' as const,
    author: 'system',
    timestamp: '2024-01-15T10:30:10Z',
    hasChildren: false,
    isExpanded: false,
    payload: {
      status: { value: 'started', type: 'value' as const },
    },
    labels: {},
  },
  {
    key: 'job-123/calc-456/calculation_completed',
    state: 'ok' as const,
    author: 'system',
    timestamp: '2024-01-15T10:32:45Z',
    hasChildren: false,
    isExpanded: false,
    payload: {
      status: { value: 'completed', type: 'value' as const },
      duration: { value: '155s', type: 'value' as const },
      documentation: { value: 'https://example.com/docs', type: 'link' as const },
      retry_of: { value: 'job-121/calc-456', type: 'ref' as const },
      config: { value: 'config.json', type: 'tree' as const },
      results: { value: 'results.md', type: 'tree' as const },
    },
    labels: {},
  },
  {
    key: 'job-124',
    state: 'error' as const,
    author: 'user@example.com',
    timestamp: '2024-01-15T11:00:00Z',
    hasChildren: true,
    isExpanded: false,
    payload: {},
    labels: {},
  },
  {
    key: 'job-125',
    state: 'warn' as const,
    author: 'admin',
    timestamp: '2024-01-15T11:15:00Z',
    hasChildren: true,
    isExpanded: true,
    payload: {},
    labels: {},
  },
  {
    key: 'job-125/calc-999',
    state: 'warn' as const,
    author: 'admin',
    timestamp: '2024-01-15T11:15:30Z',
    hasChildren: false,
    isExpanded: false,
    payload: {
      status: { value: 'warning', type: 'value' as const },
      message: { value: 'Slow performance detected', type: 'value' as const },
    },
    labels: {},
  },
];

export default function TracesSplitViewMockup() {
  const [selectedTraceKey, setSelectedTraceKey] = useState('job-123/calc-456/calculation_completed');
  const [splitPosition, setSplitPosition] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);

  const selectedTrace = mockTraces.find(t => t.key === selectedTraceKey);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.min(Math.max(newPosition, 20), 80)); // Limit between 20% and 80%
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="h-screen flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Ribbon */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Traces</h2>
        <RefreshButton />
      </div>

      {/* Split View Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Filter + Tree List */}
        <div
          className="flex overflow-hidden border-r"
          style={{ width: `${splitPosition}%` }}
        >
          {/* Filter Sidebar */}
          <aside className="w-64 bg-white border-r overflow-y-auto flex-shrink-0">
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trace Key Prefix
                </label>
                <input
                  type="text"
                  placeholder="e.g., job-123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All states</option>
                  <option value="ok">OK</option>
                  <option value="warn">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  placeholder="e.g., user@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Range
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                />
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Trace Tree List */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <div className="bg-white rounded-lg shadow-sm border divide-y">
                {mockTraces.map((trace, index) => {
                  const parts = trace.key.split('/');
                  const depth = parts.length - 1;
                  const displayName = parts[parts.length - 1];
                  const isSelected = trace.key === selectedTraceKey;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedTraceKey(trace.key)}
                      className={`p-3 cursor-pointer transition-colors grid grid-cols-12 gap-3 items-center ${
                        isSelected ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-2" style={{ paddingLeft: `${depth * 1.5}rem` }}>
                        {trace.hasChildren && (
                          <svg
                            className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${trace.isExpanded ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        {!trace.hasChildren && (
                          <span className="w-4 h-4 flex-shrink-0"></span>
                        )}
                        <span className="font-mono text-xs font-medium text-gray-900 truncate">
                          {displayName}
                        </span>
                      </div>
                      <div className="col-span-3 text-xs text-gray-500 truncate">
                        {trace.author}
                      </div>
                      <div className="col-span-2 text-xs text-gray-500">
                        {new Date(trace.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <TraceStateBadge state={trace.state} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Resizable Splitter */}
        <div
          className="w-1 bg-gray-200 hover:bg-primary-400 cursor-col-resize transition-colors relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-gray-400 group-hover:bg-primary-500 rounded-full" />
        </div>

        {/* Right Panel: Trace Detail */}
        <div
          className="flex-1 overflow-y-auto bg-gray-50"
          style={{ width: `${100 - splitPosition}%` }}
        >
          {selectedTrace ? (
            <div className="p-6 space-y-6">
              {/* Detail Header */}
              <div className="bg-white rounded-lg border shadow-sm p-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-lg font-bold text-gray-900 font-mono">{selectedTrace.key}</h1>
                  <TraceStateBadge state={selectedTrace.state} />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {selectedTrace.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(selectedTrace.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Labels */}
              {Object.keys(selectedTrace.labels).length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Labels</h2>
                  <div className="bg-white rounded-lg border shadow-sm p-4">
                    {Object.entries(selectedTrace.labels).map(([nodeKey, labels]) => (
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

              {/* Values */}
              {Object.entries(selectedTrace.payload).filter(([_, field]) => field.type === 'value').length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Values</h2>
                  <div className="bg-white rounded-lg border shadow-sm p-4 space-y-1">
                    {Object.entries(selectedTrace.payload)
                      .filter(([_, field]) => field.type === 'value')
                      .map(([key, field]) => (
                        <PayloadField
                          key={key}
                          fieldKey={key}
                          value={field.value}
                          type={field.type}
                        />
                      ))}
                  </div>
                </section>
              )}

              {/* Links */}
              {Object.entries(selectedTrace.payload).filter(([_, field]) => field.type === 'link' || field.type === 'ref').length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Links</h2>
                  <div className="bg-white rounded-lg border shadow-sm p-4 space-y-1">
                    {Object.entries(selectedTrace.payload)
                      .filter(([_, field]) => field.type === 'link' || field.type === 'ref')
                      .map(([key, field]) => (
                        <PayloadField
                          key={key}
                          fieldKey={key}
                          value={field.value}
                          type={field.type}
                        />
                      ))}
                  </div>
                </section>
              )}

              {/* Documents */}
              {Object.entries(selectedTrace.payload).filter(([_, field]) => field.type === 'tree').length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Documents</h2>
                  <div className="space-y-4">
                    {selectedTrace.key === 'job-123/calc-456/calculation_completed' && (
                      <>
                        {/* JSON Blob */}
                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline font-mono inline-flex items-center gap-1"
                              >
                                config.json
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                              <button
                                onClick={() => {
                                  const content = JSON.stringify({ timeout: 300, retries: 3, mode: 'parallel' }, null, 2);
                                  navigator.clipboard.writeText(content);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Copy to clipboard"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">tree://{selectedTrace.key}/config.json</span>
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
                            <div className="flex items-center gap-2">
                              <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline font-mono inline-flex items-center gap-1"
                              >
                                results.md
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                              <button
                                onClick={() => {
                                  const content = "# Calculation Results\n\nThe calculation completed successfully with the following metrics:\n\n- Total items processed: 1,234\n- Success rate: 99.2%\n- Average processing time: 125ms";
                                  navigator.clipboard.writeText(content);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Copy to clipboard"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">tree://{selectedTrace.key}/results.md</span>
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
                      </>
                    )}
                  </div>
                </section>
              )}

              {Object.keys(selectedTrace.payload).length === 0 && Object.keys(selectedTrace.labels).length === 0 && (
                <div className="bg-white rounded-lg border shadow-sm p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No payload or labels for this trace node.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">Select a trace to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
