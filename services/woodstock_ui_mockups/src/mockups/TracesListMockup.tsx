import { TraceStateBadge } from "../components/TraceStateBadge";
import { RefreshButton } from "../components/RefreshButton";

const mockTraces = [
  {
    key: "job-123",
    state: "ok" as const,
    author: "system",
    timestamp: "2024-01-15T10:30:00Z",
    hasChildren: true,
    isExpanded: true,
  },
  {
    key: "job-123/calc-456",
    state: "ok" as const,
    author: "system",
    timestamp: "2024-01-15T10:30:05Z",
    hasChildren: true,
    isExpanded: true,
  },
  {
    key: "job-123/calc-456/calculation_started",
    state: "ok" as const,
    author: "system",
    timestamp: "2024-01-15T10:30:10Z",
    hasChildren: false,
    isExpanded: false,
  },
  {
    key: "job-123/calc-456/calculation_completed",
    state: "ok" as const,
    author: "system",
    timestamp: "2024-01-15T10:32:45Z",
    hasChildren: false,
    isExpanded: false,
  },
  {
    key: "job-124",
    state: "error" as const,
    author: "user@example.com",
    timestamp: "2024-01-15T11:00:00Z",
    hasChildren: true,
    isExpanded: false, // Collapsed - children hidden
  },
  // job-124/calc-789 and its children are NOT shown because job-124 is collapsed
  {
    key: "job-125",
    state: "warn" as const,
    author: "admin",
    timestamp: "2024-01-15T11:15:00Z",
    hasChildren: true,
    isExpanded: true,
  },
  {
    key: "job-125/calc-999",
    state: "warn" as const,
    author: "admin",
    timestamp: "2024-01-15T11:15:30Z",
    hasChildren: false,
    isExpanded: false,
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
                const parts = trace.key.split("/");
                const depth = parts.length - 1;
                const displayName = parts[parts.length - 1]; // Show only the leaf part
                return (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors grid grid-cols-12 gap-4 items-center"
                  >
                    <div
                      className="col-span-6 flex items-center gap-2"
                      style={{ paddingLeft: `${depth * 1.5}rem` }}
                    >
                      {trace.hasChildren && (
                        <svg
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${trace.isExpanded ? "rotate-90" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                      {!trace.hasChildren && (
                        <span className="w-4 h-4 flex-shrink-0"></span>
                      )}
                      <span className="font-mono text-sm font-medium text-gray-900 truncate">
                        {displayName}
                      </span>
                    </div>
                    <div className="col-span-2 text-xs text-gray-500 truncate">
                      {trace.author}
                    </div>
                    <div className="col-span-3 text-xs text-gray-500">
                      {new Date(trace.timestamp).toLocaleString()}
                    </div>
                    <div className="col-span-1 flex justify-end">
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
