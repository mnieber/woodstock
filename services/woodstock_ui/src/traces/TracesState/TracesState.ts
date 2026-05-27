import * as Skandha from 'skandha';
import { Highlight, Selection } from 'skandha-facets';
import { TraceRecordT } from '/src/api/types/TraceRecordT';
import { TracesData } from '/src/traces/TracesState/TracesData';
import { Deletion } from '/src/traces/TracesState/facets/Deletion';
import { ViewMode } from '/src/traces/TracesState/facets/ViewMode';
import { registerTracesCtr } from '/src/traces/TracesState/registerTracesCtr';

export type PropsT = {
  getTraces: () => TraceRecordT[];
  deleteOldTraces: (olderThanTimestamp: string) => void;
};

export class TracesState {
  props: PropsT;

  tracesCtr = {
    data: new TracesData(),
    deletion: new Deletion(this),
    highlight: new Highlight<TraceRecordT>(),
    selection: new Selection<TraceRecordT>(),
    viewMode: new ViewMode(),
  };

  destroy() {
    Skandha.cleanUpCtr(this);
  }

  constructor(props: PropsT) {
    this.props = props;
    registerTracesCtr(this);
  }
}
