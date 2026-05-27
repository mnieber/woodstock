import { operation } from 'skandha';
import { TracesState } from '/src/traces/TracesState';

export class Deletion {
  static className = () => 'Deletion';

  tracesState: TracesState;

  constructor(tracesState: TracesState) {
    this.tracesState = tracesState;
  }

  @operation deleteOldTraces(olderThanTimestamp: string) {
    this.tracesState.props.deleteOldTraces(olderThanTimestamp);
  }
}
