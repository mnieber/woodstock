import * as R from 'ramda';
import { mapDataToProps } from 'skandha';
import { registerCtr } from 'skandha-mobx';
import { TraceTreeState } from '/src/traces/TraceTreeState/TraceTreeState';
import { buildTraceTree } from '/src/traces/utils/buildTraceTree';

const mapData = (state: TraceTreeState) => {
  const ctr = state.nodesCtr;

  mapDataToProps(ctr, {
    data: {
      nodes: () => buildTraceTree(state.props.getTraces()),
    },
    expansion: {
      expandableIds: () => {
        // Flatten the tree to get all node IDs
        const flattenNodes = (nodes: any[]): any[] => {
          const result: any[] = [];
          for (const node of nodes) {
            result.push(node);
            if (node.children && node.children.length > 0) {
              result.push(...flattenNodes(node.children));
            }
          }
          return result;
        };
        return R.map(R.prop('id'), flattenNodes(ctr.data.nodes));
      },
    },
  });
};

const setCallbacks = (state: TraceTreeState) => {};

export const registerNodesCtr = (state: TraceTreeState) => {
  registerCtr({
    ctr: state.nodesCtr,
    options: { name: 'TraceTreeState.Nodes' },
    initCtr: () => {
      mapData(state);
      setCallbacks(state);
    },
  });
};
