import React from 'react';
import { observer } from 'mobx-react-lite';
import { withContextProps } from 'react-props-from-context';
import { traceTreeCtx } from '/src/traces/hooks/useTraceTreeContext';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { TraceNodeT } from '/src/traces/types';
import { TraceStateBadge } from '/src/traces/components/TraceStateBadge';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  nodes: traceTreeCtx.nodes,
  expansion: traceTreeCtx.expansion,
  selectedTraceKey: tracesCtx.selectedTraceKey,
  selectTrace: tracesCtx.selectTrace,
};

const TreeNode: React.FC<{
  node: TraceNodeT;
  expansion: typeof ContextProps.expansion;
  selectedTraceKey: string | null;
  selectTrace: (traceKey: string) => void;
}> = observer((props) => {
  const hasChildren = props.node.children.length > 0;
  const isExpanded = props.expansion.isExpanded(props.node.id);
  const isSelected = props.node.trace?.traceKey === props.selectedTraceKey;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      props.expansion.toggle({ itemId: props.node.id });
    }
  };

  const handleSelect = () => {
    if (props.node.trace) {
      props.selectTrace(props.node.trace.traceKey);
    }
  };

  const indentStyle = {
    paddingLeft: `${props.node.depth * 20 + 8}px`,
  };

  return (
    <div className="TreeNode">
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200',
          {
            'bg-blue-50 hover:bg-blue-100': isSelected,
          }
        )}
        style={indentStyle}
        onClick={handleSelect}
      >
        {/* Expand/collapse icon */}
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        {/* Node label */}
        <span className="flex-1 text-sm font-medium text-gray-800">
          {props.node.label}
        </span>

        {/* State badge for leaf nodes with trace data */}
        {props.node.trace && (
          <TraceStateBadge state={props.node.trace.traceState} />
        )}
      </div>

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div>
          {props.node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expansion={props.expansion}
              selectedTraceKey={props.selectedTraceKey}
              selectTrace={props.selectTrace}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export const TraceTreeView = observer(
  withContextProps((props: PropsT & typeof ContextProps) => {
    return (
      <div className={cn('TraceTreeView bg-white', props.className)}>
        {props.nodes.length === 0 && (
          <div className="p-4 text-gray-500 italic text-sm">No traces</div>
        )}
        {props.nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            expansion={props.expansion}
            selectedTraceKey={props.selectedTraceKey}
            selectTrace={props.selectTrace}
          />
        ))}
      </div>
    );
  }, ContextProps)
);
