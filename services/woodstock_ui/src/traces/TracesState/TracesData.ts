import * as R from 'ramda';
import { data } from 'skandha';
import { TraceRecordT } from '/src/api/types/TraceRecordT';

export class TracesData {
  static className = () => 'TracesData';

  @data traces: TraceRecordT[] = [];

  @data get traceByKey() {
    return R.indexBy(R.prop('traceKey'), this.traces);
  }
}
