import { observer } from 'mobx-react-lite';
import { withContextProps } from 'react-props-from-context';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  queryTraces: tracesCtx.queryTraces,
};

export const RefreshButton = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const handleRefresh = () => {
      props.queryTraces.refetch();
    };

    const isRefreshing = props.queryTraces.isFetching;

    return (
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={cn(
          'RefreshButton flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          props.className
        )}
        title="Refresh traces"
      >
        <svg
          className={cn('w-4 h-4', { 'animate-spin': isRefreshing })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    );
  }, ContextProps)
);
