import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { TraceNodeT, createTraceNode } from '/src/traces/types';

/**
 * Builds a hierarchical tree structure from a flat list of traces.
 * Traces are grouped by common key prefixes (using '/' as separator).
 *
 * For example:
 * - job-123/calc-456/calculation_started
 * - job-123/calc-456/calculation_completed
 *
 * Would create a tree:
 * job-123
 *   └── calc-456
 *       ├── calculation_started
 *       └── calculation_completed
 */
export const buildTraceTree = (traces: TraceRecordT[]): TraceNodeT[] => {
  // Sort traces by timestamp (older events first)
  const sortedTraces = [...traces].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  const nodeMap = new Map<string, TraceNodeT>();
  const rootNodes: TraceNodeT[] = [];

  for (const trace of sortedTraces) {
    const parts = trace.traceKey.split('/');

    // Build the tree path by creating intermediate nodes as needed
    for (let i = 0; i < parts.length; i++) {
      const pathSoFar = parts.slice(0, i + 1).join('/');

      // Skip if we've already created this node
      if (nodeMap.has(pathSoFar)) {
        continue;
      }

      const label = parts[i];
      const isLeaf = i === parts.length - 1;
      const parentPath = i > 0 ? parts.slice(0, i).join('/') : null;
      const parentNode = parentPath ? nodeMap.get(parentPath) : undefined;

      const node = createTraceNode(
        pathSoFar,
        label,
        i, // depth
        isLeaf ? trace : undefined, // Only leaf nodes have trace data
        parentNode
      );

      nodeMap.set(pathSoFar, node);

      // Add to parent's children or to root
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        rootNodes.push(node);
      }
    }
  }

  return rootNodes;
};
