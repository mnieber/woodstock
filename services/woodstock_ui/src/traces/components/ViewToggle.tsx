import { observer } from 'mobx-react-lite';
import { withContextProps } from 'react-props-from-context';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  viewMode: tracesCtx.viewMode,
};

export const ViewToggle = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    const viewMode = props.viewMode.mode;

    return (
      <div
        className={cn(
          'ViewToggle flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50',
          props.className
        )}
      >
        <button
          onClick={() => props.viewMode.setMode('list')}
          className={cn(
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          )}
        >
          List
        </button>
        <button
          onClick={() => props.viewMode.setMode('tree')}
          className={cn(
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'tree'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          )}
        >
          Tree
        </button>
      </div>
    );
  }, ContextProps)
);
