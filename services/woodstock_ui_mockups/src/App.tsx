import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TracesListMockup from './mockups/TracesListMockup';
import TraceDetailMockup from './mockups/TraceDetailMockup';
import TracesSplitViewMockup from './mockups/TracesSplitViewMockup';
import ComponentShowcase from './mockups/ComponentShowcase';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900">Woodstock UI Mockups</h1>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Split View
                </Link>
                <Link
                  to="/list"
                  className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                  List Only
                </Link>
                <Link
                  to="/detail"
                  className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Detail Only
                </Link>
                <Link
                  to="/components"
                  className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Components
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<TracesSplitViewMockup />} />
          <Route path="/list" element={<TracesListMockup />} />
          <Route path="/detail" element={<TraceDetailMockup />} />
          <Route path="/components" element={<ComponentShowcase />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
