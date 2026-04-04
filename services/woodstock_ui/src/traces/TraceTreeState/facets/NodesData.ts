import * as R from 'ramda';
import { data } from 'skandha';
import { TraceNodeT } from '/src/traces/types';

export class NodesData {
  static className = () => 'NodesData';

  @data nodes: TraceNodeT[] = [];

  @data get nodeById() {
    return R.indexBy(R.prop('id'), this.flattenNodes(this.nodes));
  }

  // Helper to flatten the tree into a flat array
  private flattenNodes(nodes: TraceNodeT[]): TraceNodeT[] {
    const result: TraceNodeT[] = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        result.push(...this.flattenNodes(node.children));
      }
    }
    return result;
  }
}
