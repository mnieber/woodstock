import React from 'react';
import { observer } from 'mobx-react-lite';
import { withContextProps } from 'react-props-from-context';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { cn } from '/src/utils/classnames';

export const formFields = {
  traceKeyPrefix: 'traceKeyPrefix',
  traceState: 'traceState',
  author: 'author',
  timeRangeStart: 'timeRangeStart',
  timeRangeEnd: 'timeRangeEnd',
};

const ContextProps = {
  filter: tracesCtx.filter,
  applyFilter: tracesCtx.applyFilter,
};

export type PropsT = {
  className?: any;
};

export const TraceFilterForm = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const handleApply = (e: React.FormEvent) => {
      e.preventDefault();
      props.applyFilter();
    };

    const handleClearFilters = () => {
      props.filter.clearAll();
      props.applyFilter();
    };

    return (
      <form onSubmit={handleApply} className={cn('TraceFilterForm p-4 space-y-4', props.className)}>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Traces</h3>

        {/* Trace Key Prefix */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Trace Key Prefix</label>
          <input
            type="text"
            value={props.filter.traceKeyPrefix}
            onChange={(e) => props.filter.setTraceKeyPrefix(e.target.value)}
            placeholder="e.g., job-123"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Trace State */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">State</label>
          <select
            value={props.filter.traceState}
            onChange={(e) => props.filter.setTraceState(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            <option value="ok">OK</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Author */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Author</label>
          <input
            type="text"
            value={props.filter.author}
            onChange={(e) => props.filter.setAuthor(e.target.value)}
            placeholder="e.g., alice"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time Range Start */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Start Time</label>
          <input
            type="datetime-local"
            value={props.filter.timeRangeStart}
            onChange={(e) => props.filter.setTimeRangeStart(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time Range End */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">End Time</label>
          <input
            type="datetime-local"
            value={props.filter.timeRangeEnd}
            onChange={(e) => props.filter.setTimeRangeEnd(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="flex-1 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    );
  }, ContextProps)
);
