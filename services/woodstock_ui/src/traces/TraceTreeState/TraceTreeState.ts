import * as Skandha from 'skandha';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { NodesData } from '/src/traces/TraceTreeState/facets/NodesData';
import { Expansion } from '/src/traces/TraceTreeState/facets/Expansion';
import { registerNodesCtr } from '/src/traces/TraceTreeState/registerNodesCtr';

export type PropsT = {
  getTraces: () => TraceRecordT[];
};

export class TraceTreeState {
  props: PropsT;

  nodesCtr = {
    data: new NodesData(),
    expansion: new Expansion(),
  };

  destroy() {
    Skandha.cleanUpCtr(this);
  }

  constructor(props: PropsT) {
    this.props = props;
    registerNodesCtr(this);
  }
}
