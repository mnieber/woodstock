import { makeAutoObservable } from 'mobx';
import { TraceFilterT } from '/src/api/types/TraceFilterT';

export class TraceFilterState {
  traceFilterOptions: TraceFilterT = {};
  isTraceFilterEnabled: boolean = false;

  setTraceFilterOptions(options: TraceFilterT) {
    this.traceFilterOptions = options;
  }

  setIsTraceFilterEnabled(enabled: boolean) {
    this.isTraceFilterEnabled = enabled;
  }

  constructor() {
    makeAutoObservable(this);
  }
}
