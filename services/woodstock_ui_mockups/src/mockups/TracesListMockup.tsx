import { TraceStateBadge } from '../components/TraceStateBadge';
import { RefreshButton } from '../components/RefreshButton';

const mockTraces = [
  {
    key: 'job-123',
    state: 'ok' as const,
    author: 'system',
    timestamp: '2024-01-15T10:30:00Z',
    hasChildren: true,
  },
  {
    key: 'job-123/calc-456',
    state: 'ok' as const,
    author: 'system',
    timestamp: '2024-01-15T10:30:05Z',
    hasChildren: true,
  },
  {
    key: 'job-123/calc-456/calculation_started',
    state: 'info' as const,
    author: 'system',
    timestamp: '2024-01-15T10:30:10Z',
    hasChildren: false,
  },
  {
    key: 'job-123/calc-456/calculation_completed',
    state: 'ok' as const,
    author: 'system',
    timestamp: '2024-01-15T10:32:45Z',
    hasChildren: false,
  },
  {
    key: 'job-124',
    state: 'error' as const,
    author: 'user@example.com',
    timestamp: '2024-01-15T11:00:00Z',
    hasChildren: true,
  },
  {
    key: 'job-124/calc-789',
    state: 'error' as const,
    author: 'user@example.com',
    timestamp: '2024-01-15T11:00:15Z',
    hasChildren: true,
  },
  {
    key: 'job-124/calc-789/calculation_failed',
    state: 'error' as const,
    author: 'user@example.com',
    timestamp: '2024-01-15T11:01:30Z',
    hasChildren: false,
  },
];

export default function TracesListMockup() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Ribbon */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Traces</h2>
        <RefreshButton />
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filter Panel */}
        <aside className="w-64 bg-white border-r overflow-y-auto">
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
                <option value="info">Info</option>
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

        {/* Trace List */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border divide-y">
              {mockTraces.map((trace, index) => {
                const depth = trace.key.split('/').length - 1;
                return (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {trace.hasChildren && (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          <span className="font-mono text-sm font-medium text-gray-900">
                            {trace.key}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{trace.author}</span>
                          <span>•</span>
                          <span>{new Date(trace.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <TraceStateBadge state={trace.state} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
