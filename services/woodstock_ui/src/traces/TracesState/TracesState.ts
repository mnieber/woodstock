import * as Skandha from 'skandha';
import { Selection } from 'skandha-facets';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { TracesData } from '/src/traces/TracesState/TracesData';
import { registerTracesCtr } from '/src/traces/TracesState/registerTracesCtr';

export type PropsT = {
  getTraces: () => TraceRecordT[];
};

export class TracesState {
  props: PropsT;

  tracesCtr = {
    data: new TracesData(),
    selection: new Selection<TraceRecordT>(),
  };

  destroy() {
    Skandha.cleanUpCtr(this);
  }

  constructor(props: PropsT) {
    this.props = props;
    registerTracesCtr(this);
  }
}
