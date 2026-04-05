import React from 'react';
import { observer } from 'mobx-react-lite';
import { withContextProps } from 'react-props-from-context';
import { Link } from 'wouter';
import { traceTreeCtx } from '/src/traces/hooks/useTraceTreeContext';
import { tracesCtx } from '/src/traces/hooks/useTracesContext';
import { tracesNav } from '/src/traces/routes';
import { TraceNodeT } from '/src/traces/types';
import { TraceStateBadge } from '/src/traces/components/TraceStateBadge';
import { cn } from '/src/utils/classnames';

export type PropsT = {
  className?: any;
};

const ContextProps = {
  nodes: traceTreeCtx.nodes,
  expansion: traceTreeCtx.expansion,
  trace: tracesCtx.trace,
};

const TreeNode: React.FC<{
  node: TraceNodeT;
  expansion: typeof ContextProps.expansion;
  highlightedTraceKey: string | undefined;
}> = observer((props) => {
  const hasChildren = props.node.children.length > 0;
  const isExpanded = props.expansion.isExpanded(props.node.id);
  const isHighlighted = props.node.trace?.traceKey === props.highlightedTraceKey;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      props.expansion.toggle({ itemId: props.node.id });
    }
  };

  const indentStyle = {
    paddingLeft: `${props.node.depth * 20 + 8}px`,
  };

  const url = props.node.trace
    ? tracesNav.trace({ traceKey: props.node.trace.traceKey }).url
    : '#';

  const content = (
    <>
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
    </>
  );

  return (
    <div className="TreeNode">
      {props.node.trace ? (
        <Link
          href={url}
          className={cn(
            'flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-gray-100 border-b border-gray-200',
            {
              'bg-blue-50 hover:bg-blue-100': isHighlighted,
            }
          )}
          style={indentStyle}
        >
          {content}
        </Link>
      ) : (
        <div
          className={cn(
            'flex items-center gap-2 py-2 px-2 border-b border-gray-200'
          )}
          style={indentStyle}
        >
          {content}
        </div>
      )}

      {/* Render children if expanded */}
      {hasChildren && isExpanded && (
        <div>
          {props.node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expansion={props.expansion}
              highlightedTraceKey={props.highlightedTraceKey}
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
            highlightedTraceKey={props.trace?.traceKey}
          />
        ))}
      </div>
    );
  }, ContextProps)
);
